import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { State } from '../../../../interfaces/state.js';
import { AdminModel } from '../../../../../logger/model/admin.model.js';

export class Context {
    private state: State | null;

    private message: OmitPartialGroupDMChannel<Message<boolean>> | undefined;

    private admin: AdminModel;

    constructor() {
        this.state = null;
        this.message = undefined;
        this.admin = {
            id: 0,
            username: '',
            password: '',
            createdAt: ''
        };
    }

    async next(): Promise<void | null> {
        this.state?.next();
    }

    public setState(state: State | null) {
        this.state = state;
    }

    public getState() {
        return this.state;
    }

    public getStateName() {
        return this.state?.name;
    }

    public setMessage(message: OmitPartialGroupDMChannel<Message<boolean>>){
        this.message = message;
    }

    public getMessage(){
        return this.message;
    }

    public setAdminUsername(username: string){
        this.admin.username = username;
    }

    public setAdminPassword(password: string){
        this.admin.password = password;
    }

    public setAdminCreatedAt(createdAt: string){
        this.admin.createdAt = createdAt;
    }

    public getAdminUsername(){
        return this.admin.username;
    }

    public getAdminPassword(){
        return this.admin.password;
    }

    public getAdminCreatedAt(){
        return this.admin.createdAt;
    }

    public getAdmin(){
        return this.admin;
    }

    public resetAdmin(){
        this.admin.username = '';
        this.admin.password = '';
        this.admin.createdAt = '';
    }
}