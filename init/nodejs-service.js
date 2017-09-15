var reg = require("cla/reg");

reg.register('service.nodejs.run', {
    name: _('Run Node.js Code'),
    icon: '/plugin/cla-nodejs-plugin/icon/nodejs.svg',
    form: '/plugin/cla-nodejs-plugin/form/nodejs-form.js',
    handler: function(ctx, config) {

        var ci = require("cla/ci");
        var log = require("cla/log");
        var fs = require("cla/fs");
        var path = require('cla/path');
        var reg = require('cla/reg');
        var proc = require("cla/process");
        var CLARIVE_BASE = proc.env('CLARIVE_BASE');
        var CLARIVE_TEMP = proc.env('TMPDIR');
        var filePath;
        var errors = config.errors;
        var server = config.server;
        var response;
        var remoteTempPath = config.remoteTempPath;
        var isJob = ctx.stash("job_dir");
        var nodeJsPath = config.nodeJsPath;

        function remoteCommand(params, command, server, errors) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Node.js execute'),
                config: {
                    errors: errors,
                    server: server,
                    path: command,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rcOk,
                    rc_error: params.rcError,
                    rc_warn: params.rcWarn
                }
            });
            return output;
        }

        function shipFiles(server, filePath, remoteTempPath) {
            var output = reg.launch('service.fileman.ship', {
                name: _('Node.js ship file'),
                config: {
                    server: server,
                    local_path: filePath,
                    remote_path: remoteTempPath
                }
            });
        }

        if (isJob) {
            filePath = path.join(isJob, "nodeJs-code.js");
            fs.createFile(filePath, config.code);
        } else {
            filePath = path.join(CLARIVE_TEMP, "nodeJs-code.js");
            fs.createFile(filePath, config.code);
        }

        var nodeJsArgs = config.nodeJsArgs || [];
        var nodeJsParams = nodeJsArgs.join(" ");
        var nodeJsCommand;
        if (nodeJsPath == '') {
            nodeJsCommand = "node "
        } else {
            nodeJsCommand = nodeJsPath + " ";
        }

        shipFiles(server, filePath, remoteTempPath);
        var remoteFilePath = path.join(remoteTempPath, "nodeJs-code.js");
        var nodeJsRemoteCommand = nodeJsCommand + nodeJsParams + " " + remoteFilePath;

        log.info(_("Executing Node.js code"));
        response = remoteCommand(config, nodeJsRemoteCommand, server, errors);
        reg.launch('service.scripting.remote', {
            name: _('Node.js remove file'),
            config: {
                errors: errors,
                server: server,
                path: "rm " + remoteFilePath
            }
        });
        log.info(_("Node.js code executed: "), response.output);
        fs.deleteFile(filePath);

        return response.output;
    }
});