import Database from "explorer-core/src/database/DAL/database/databaseStore";
import PubSubMessage from "explorer-core/src/database/DAL/database/PubSub/pubSubMessage";
import { PubSubMessageType } from "explorer-core/src/database/DAL/database/PubSub/MessageType";
import { delay } from "explorer-core/src/common";

const ACCESS_REQUEST_INTERVAL = 500;

let TASK_ID = 0;

enum State
{
    Stop,
    Request,
    Using,
    Return

}

export default class AccessBroadcaster
{
    databaseName: string;
    id: string;
    _state: State;
    private resolver;
    task: Promise<unknown>;
    constructor(databaseName: string, id: string)
    {
        this.databaseName = databaseName;
        this.id = id;
    }

    async request()
    {
        await this.setState(State.Request);
    }

    async take()
    {
        await this.setState(State.Using);
    }

    async return(to: string = null)
    {
        this._state = State.Stop;
        await this.cancelTask();
        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage({
            type: PubSubMessageType.AccessReturn,
            value: to
        }));
    }

    async setState(s: State)
    {
        if (this._state != s)
        {
            await this.cancelTask();
            this._state = s;
            this.task = this.loop();
        }
    }

    get state()
    {
        return this._state;
    }

    private async cancelTask()
    {
        0;
        if (this.task)
        {
            this.resolver();
            await this.task;
            this.task = null;
        }
    }

    private async loop()
    {
        if (this.task)
            return this.task;
        return new Promise(async function (resolve, reject)
        {
            const taskId = ++TASK_ID;
            this.resolver = resolve;
            while (this.state != State.Stop && taskId == TASK_ID)
            {
                switch (this.state)
                {
                    case State.Request:
                        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage(
                            {
                                type: PubSubMessageType.AccessRequest,
                                value: this.id
                            }));
                        break;


                    case State.Using:
                        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage(
                            {
                                type: PubSubMessageType.AccessTaken,
                                value: this.id
                            }));
                        break;
                    default:
                        break;
                }
                await delay(ACCESS_REQUEST_INTERVAL);
            }
            resolve();
        }.bind(this));
    }
}