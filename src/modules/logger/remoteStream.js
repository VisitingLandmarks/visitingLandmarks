import bunyan from 'bunyan';
import {logRemote} from '../socket.io/client';
import omit from 'lodash/omit';

export default function RemoteStream() {
}
RemoteStream.prototype.write = function (rec) {
    logRemote({
        ...omit(rec, ['name', 'v', 'level', 'hostname']),
        level: bunyan.nameFromLevel[rec.level],
    });
};