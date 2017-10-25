# Node.js Plugin

<img src="https://cdn.rawgit.com/clarive/cla-nodejs-plugin/master/public/icon/nodejs.svg?sanitize=true" alt="NodeJS Plugin" title="NodeJS Plugin" width="120" height="120">

The Node.js plugin will allow you to execute Node.js code in Clarive and view its result.

# What is Node.js?

Node.js is a platform built on Chrome's JavaScript runtime for easily building fast and scalable network applications.
Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for
data-intensive, real-time applications that run across distributed devices.

## Requirements

To be able to use the plugin correctly, you must have [Node.js](https://nodejs.org/es/) installed on the server where you wish to run the code.

## Installation

To install the plugin, place the `cla-nodejs-plugin` folder inside `$CLARIVE_BASE/plugins` directory in the Clarive
instance.

### Parameters

The service will execute the code you write in it on the server you specify.  It will create a temporary file with the
code which will be shipped to the specified server.

The parameters available for this service are:

- **Server (variable name: server)** - The GenericServer Resource where you wish to execute the code.
- **User (user)** - User which will be used to connect to the server.
- **Node.js path (user)** - Full path for Node.js launching script, including the file. If you leave it empty, the plugin will
  launch *node* as a system environment variable.
- **Node.js parameters (user)** - Additional flags for the Node.js command.
- **Remote temporary path (user)** - Temporary path to which the file with the code will be shipped.
- **Node.js code editor (user)** - Enter here the code you wish to execute.

**Only Clarive EE**

- **Errors and output** - These two fields deal with managing control errors. The options are:
   - **Fail and output error** - Search for configured error pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Warning and output warning** - Search for configured warning pattern in script output. If found, an error message
     is displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed to define the behavior with these
     fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
   - **Warning** - Range of return code values to warn the user. A warning will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
     monitor.

## How to use

### In Clarive EE

You can find this service in the Rule Designer palette.

Op Name: **Run Node.js Code**

Example:

```yaml
      Server: nodejs_server
      Node.js path: /sytem/node.sh
      Remote temporal path: /tmp
      Node.js code editor: console.log('This is a nodejs example'); 
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: NodeJS demo
do:
   - nodejs_script:
       server: nodejs_server   # Required. Use the mid set to the resource you created
       user: ${username}
       remote_temp_path: "/tmp" # Required
       nodejs_args: ["-d"]            
       code: |                  # Required
          console.log('This is a nodejs example');
```

##### Outputs

###### Success

The plugin will return all the console output you set in the Node.js code.

```yaml
do:
    - myvar = nodejs_script:
       server: nodejs_server   # Required. Use the mid set to the resource you created
       user: "clarive_user"
       remote_temp_path: "/tmp"
       nodejs_args: ["-d"]            
       code: |                  # Required
          console.log('This is a nodejs example');
    - echo: ${myvar}
```

For this command the output will be similar to this one:

```yaml
This is a nodejs example 
```

###### Possible configuration failures

**Code failed**

```yaml
Error running remote script
```

Make sure that the option is available and you code is correct to be executed in NodeJS.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "nodejs_script": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Code` not available for op "nodejs_script"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.