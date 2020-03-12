export enum PubSubMessageType
{
    AccessRequest = "accessRequest",
    AccessTaken = "accessTaken",
    PublishVersion = "PublishVersion",
    // TODO maybe create new message for connecting to the DB. Some of the other peers should than publish DB head
}