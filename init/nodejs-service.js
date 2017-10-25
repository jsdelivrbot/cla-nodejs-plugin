var reg = require("cla/reg");

reg.register('service.nodejs.run', {
    name: _('Run Node.js Code'),
    icon: '/plugin/cla-nodejs-plugin/icon/nodejs.svg',
    form: '/plugin/cla-nodejs-plugin/form/nodejs-form.js',
    rulebook: {
        moniker: 'nodejs_script',
        description: _('Executes NodeJS scripts'),
        required: [ 'server', 'remote_temp_path', 'code'],
        allow: ['server', 'code', 'remote_temp_path', 'user', 'nodejs_path', 'nodejs_args', 'errors'],
        mapper: {
            'remote_temp_path':'remoteTempPath',
            'nodejs_path': 'nodeJsPath',
            'nodejs_args': 'nodeJsArgs'
        },
        examples: [{
            nodejs_script: {
                server: 'nodejs_server',
                user: 'clarive_user',
                remote_temp_path: "/tmp/scripts/",
                nodejs_path: "",
                nodejs_args: ["-d"],
                code: `console.log('This is a nodejs example');`,
                errors: "fail"
            }
        }]
    },
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
        var errors = config.errors || "fail";
        var server = config.server;
        var response;
        var remoteTempPath = config.remoteTempPath || "/tmp";
        var isJob = ctx.stash("job_dir");
        var nodeJsPath = config.nodeJsPath;
        var fileName = "clarive-nodeJs-code-" + Date.now() + ".js";
        var user = config.user || "";

        function remoteCommand(params, command, server, errors, user) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Node.js execute'),
                config: {
                    errors: errors,
                    server: server,
                    user: user,
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

        function shipFiles(server, filePath, remoteTempPath, user) {
            var output = reg.launch('service.fileman.ship', {
                name: _('Node.js ship file'),
                config: {
                    server: server,
                    user: user,
                    local_path: filePath,
                    remote_path: remoteTempPath
                }
            });
        }

        if (isJob) {
            filePath = path.join(isJob, fileName);
            fs.createFile(filePath, config.code);
        } else {
            filePath = path.join(CLARIVE_TEMP, fileName);
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

        shipFiles(server, filePath, remoteTempPath, user);
        var remoteFilePath = path.join(remoteTempPath, fileName);
        var nodeJsRemoteCommand = nodeJsCommand + nodeJsParams + " " + remoteFilePath;

        log.info(_("Executing Node.js code"));
        response = remoteCommand(config, nodeJsRemoteCommand, server, errors, user);
        reg.launch('service.scripting.remote', {
            name: _('Node.js remove file'),
            config: {
                errors: errors, 
                server: server,
                user: user,
                path: "rm " + remoteFilePath
            }
        });
        log.info(_("Node.js code executed: "), response.output);
        fs.deleteFile(filePath);

        return response.output;
    }
});