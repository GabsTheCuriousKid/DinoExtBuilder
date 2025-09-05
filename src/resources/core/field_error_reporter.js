import Blockly from 'blockly/core';

export class FieldErrorReporter extends Blockly.FieldLabelSerializable {
    constructor(varName) {
        super('error', null);
        this.varName_ = varName || 'err';
        this.setTooltip('The caught error object');
    }

    getVarName() {
        return this.varName_;
    }

    initView() {
        super.initView();
        if (this.fieldGroup_) {
            Blockly.utils.dom.addClass(this.fieldGroup_, 'blocklyReporterShape');
        }
    }
}

Blockly.fieldRegistry.register('field_error_reporter', FieldErrorReporter);