oninit(function(exports, shared) {
    var Control = shared.BEMContext.prototype.components.control;

    shared.BEMContext.prototype.components.button = class Button extends Control {
        constructor(props) {
            super(props);

            this._focusedByPointer = false;
            this._isPointerPressInProgress = false;

            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
        }
        componentDidMount () {
            super.componentDidMount()
            this.refs.control.addEventListener('mousedown', this._onMouseDown);
            
        }
        _onFocus () {
            if(this._isPointerPressInProgress) return;
            super._onFocus();
            if (!this.hasMod('disabled') && !this._isPointerPressInProgress) this.setMod('focused-hard');
        }
        _onBlur () {
            super._onBlur();
            this.setMod('focused-hard', false);
        }
        _onMouseDown () {
            if (!this.state.mods.disabled) {
                this._isPointerPressInProgress = true;
                this.setMod('pressed', true);
                document.addEventListener('mouseup', this._onMouseUp);
            }
        }
        _onMouseUp () {
            document.removeEventListener('mouseup', this._onMouseUp);
            this._updateChecked();
            this._isPointerPressInProgress = false;
            this.setMod('pressed', false);
        }
        _updateChecked () {
            this.hasMod('togglable') &&
                (this.hasMod('togglable', 'check')
                    ? this.toggleMod('checked')
                    : this.setMod('checked'));

            return this;
        }
    }
});
block('button').attrs()(function () {
        return this.extend(applyNext(), { ref: 'control' })
    })
block('button').match(function () {
    return !this.ctx._react;
})(
    def()(function () {
        var ctx = this.extend({}, this.ctx);
        return this.createElement(this.components.button, { bemjson: ctx });
    })
);
