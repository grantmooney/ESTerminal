if (window.jQuery) {  
    // Load esterminal 
    (function($) {
        $.fn.esTerminal = function(cmds) {
            var $this = $(this);
            var activeCmd = null;
            cmds['help'] = {
                    args: {},
                    func: function(data, callback) {
                        cmdStr = 'Available commands:';
                        for (var cmd in cmds) { cmdStr += '<br/>&nbsp;<a cmd="'+cmd+'">'+cmd+'</a>'; }
                        callback(cmdStr);
                    }
                };
            $this.addClass("esTerminal");
            $this.append('<div>Type or click "<a cmd="help">help</a>" for a list of options.</div><div class="prompt"><label></label><input type="text" autocomplete="off"></input></div>');
            $this.on('keydown', function(e){
              if(e.keyCode == 13) { //enter
                e.preventDefault();
                if (activeCmd != null) {
                    var input = $this.find('input:not([readonly])'),
                        args = activeCmd['args'],
                        p = 0;
                    var argKeys = Object.keys(args);
                    for (var arg in args) {
                        if (!(arg in activeCmd['input'])) {
                            activeCmd['input'][arg] = input.val();
                            if (Object.keys(activeCmd['input']).length == argKeys.length) {
                                activeCmd['func'](activeCmd['input'], cmdCallback);
                            } else {
                                input.after('<span>Enter '+argKeys[p+1]+': </span>');
                                input.prop('readonly', true);
                                $this.append('<div class="prompt"><label></label><input type="'+args[argKeys[p+1]]+'" autocomplete="off"></input></div>');
                                $this.find('input:not([readonly])').focus();
                            }
                            break;
                        }
                        p++;
                    }
                } else {
                    processcmd();
                }
                return false;
              }
            });
            $this.on('click contextmenu', function(e) {
                e.preventDefault();
                $this.find('input:not([readonly])').focus();
                return false;
            });
            $this.on('click', 'a[cmd]', function(e){
                e.preventDefault();
                processcmd($(this).attr('cmd'));
                return false;
            });
            var cmdCallback = function(string) {
                console.log(string);
                activeCmd = null;
                var input = $this.find('input:not([readonly])');
                input.after('<span>'+string+'</span>');
                input.prop('readonly', true);
                $this.append('<div class="prompt"><label></label><input type="text" autocomplete="off"></input></div>');
                $this.find('input:not([readonly])').focus();
            }
            var cancelcmd = function() {
                activeCmd = {};
                var input = $this.find('input:not([readonly])');
                input.after('<span class="text-red">cmd canceled.</span>');
                input.prop('readonly', true);
                $this.append('<div class="prompt"><label></label><input type="text" autocomplete="off"></input></div>');
                $this.find('input:not([readonly])').focus();
            }
            var processcmd = function(cmd) {
                var input = $this.find('input:not([readonly])');
                if (typeof cmd == 'undefined') { cmd = input.val(); } else { input.val(cmd); }
                if (cmd in cmds) {
                    args = cmds[cmd]['args'];
                    if (Object.keys(args).length > 0) {
                        activeCmd = cmds[cmd];
                        activeCmd['input'] = {};
                        input.after('<span>Enter '+Object.keys(args)[0]+':</span>');
                        input.prop('readonly', true);
                        $this.append('<div class="prompt"><label></label><input type="text" autocomplete="off"></input></div>');
                        $this.find('input:not([readonly])').focus();
                    } else {
                        cmds[cmd]['func']({}, cmdCallback);
                    }
                } else {
                    if (cmd.length > 0) {
                        input.after('<span>'+cmd+' : command not recognized</span>');
                    }
                    input.prop('readonly', true);
                    $this.append('<div class="prompt"><label></label><input type="text" autocomplete="off"></input></div>');
                }
                $this.find('input:not([readonly])').focus();
            }
        };
    }(jQuery));
} else {
    // jQuery is not loaded
    console.error('jQuery is required for this version of esterminal!');
}