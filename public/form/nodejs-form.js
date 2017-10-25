(function(params) {
    var data = params.data;

    var serverComboBox = Cla.ui.ciCombo({
        name: 'server',
        role: 'Server',
        fieldLabel: _('Server'),
        value: data.server || '',
        allowBlank: false,
        width: 400,
        with_vars: 1
    });

    var userTextField = Cla.ui.textField({
        name: 'user',
        fieldLabel: _('User'),
        value: data.user || '',
        allowBlank: true
    });

    var nodeJsPathTextField = Cla.ui.textField({
        name: 'nodeJsPath',
        fieldLabel: _('Node.js path'),
        value: params.data.nodeJsPath || '',
    });

    var argumentsTextField = Cla.ui.arrayGrid({
        name: 'nodeJsArgs',
        fieldLabel: _('Node.js parameters'),
        value: params.data.nodeJsArgs,
        description: _('Node.js parameters'),
        default_value: '.',
    });

    var nodeJsCodeEditor = Cla.ui.codeEditor({
        name: 'code',
        fieldLabel: _('Code Editor'),
        value: params.data.code || '',
        mode: 'nodejs',
        height: 500,
        anchor: '100%'
    });

    var remoteTempPathTextField = Cla.ui.textField({
        name: 'remoteTempPath',
        fieldLabel: _('Remote temp path'),
        value: params.data.remoteTempPath || '',
        allowBlank: false
    });

    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            serverComboBox,
            userTextField,
            nodeJsPathTextField,
            argumentsTextField,
            remoteTempPathTextField,
            nodeJsCodeEditor,
            errorBox
        ]
    });


    return panel;
})