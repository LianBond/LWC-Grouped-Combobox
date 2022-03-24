import { LightningElement, track, api } from 'lwc';

export default class GroupedCombobox extends LightningElement {

    @api label = 'Combobox Label'
    @api name;
    @api id;
    @api required;
    @api errorMessage;
    
    _showDropDown = false;
    _valueInitialSet = true;
    _selectedValue;
    _groupsAndOptions = [{groupName: 'Cat A', options: [{label: 'Option 1', value: 'option1'}]}, {groupName: 'Cat B', options: [{label: 'Option 2', value: 'option2'}]}];
    
    get comboboxTriggerClass () {
        if (this._showDropDown) {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open';
        } else {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        }
    }

    @api get input () {
        return this._groupsAndOptions;
    }

    set input (value) {
        console.log('set input ' + this.id, value)
        if (value) {
            this._groupsAndOptions = JSON.parse(JSON.stringify(value));
            this.setSelectedOnOptions();
            this.validateSelectedValue();
        } else {
            this._groupsAndOptions = [];
        }
        return true;
    }

    @api get readOnly () {
        return this._readOnly;
    }

    set readOnly (value) {
        console.log('readonly being set ' + value)
        this._readOnly = value;
        return true;
    }

    get buttonClass () {
        let buttonClass = '';
        if (this.errorMessage) {
            buttonClass = 'slds-has-error ';
        }
        if (this._readOnly) {
            buttonClass += 'slds-is-disabled '
        }
        if (this._valueSelected) {
            buttonClass += 'slds-input_faux slds-combobox__input slds-combobox__input-value'
        } else if (!this._valueSelected && this._showDropDown) {
            buttonClass += 'slds-input_faux slds-combobox__input slds-has-focus'
        } else {
            buttonClass += 'slds-input_faux slds-combobox__input'
        }
        return buttonClass;
    }

    get buttonText () {
        if (this._valueSelected) {
            return this._selectedValueLabel;
        } else {
            return 'Select an Option…'
        }
    }

    get _valueSelected () {
        return this.value ? true : false;
    }

    get _selectedValueLabel () {
        let valueLabel = '';

        this._groupsAndOptions.forEach(group => {
            group.options.forEach(option => {
                if (option.value === this.value) {
                    valueLabel = option.label;
                }
            })
        })
        
        return valueLabel;
    }

    @api
    get value () {
        return this._selectedValue;
    }

    set value (value) {
        this._selectedValue = value;
        if (this._valueSelected) {
            this.errorMessage = null;
        }
        this.setSelectedOnOptions();
        this.handleCloseDropDown();
        return true;
    }


    connectedCallback() {
        this.setSelectedOnOptions();
        this.validateSelectedValue(); //check that selected value exists in the _groupsAndOptions provided
    }

    validateSelectedValue () {
        let found = false;
        this._groupsAndOptions.forEach(group => {
            group.options.forEach(option => {
                if (option.value === this.value) {
                    found = true;
                }
            })
        })
        
        if (!found) { //selected value not found in the _groupsAndOptions list, therefore clearing the value field
            this.value = null;
            console.warn('Provided value not found in the _groupsAndOptions list');
        } 
    }

    fireOnChangeEvent () {
        if (this.value) { 
            const onChangeEvent = new CustomEvent("change", {
                detail: {name: this.name, id: this.id, value: this.value}
              });
    
            this.dispatchEvent(onChangeEvent);
        }
    }

    setSelectedOnOptions () {
        this._groupsAndOptions.forEach(group => {
            group.options.forEach(option => {
                if (option.value === this.value) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            })
        })
    }

    handleDropDownClick () {
        this._showDropDown = !this._showDropDown;
    }

    handleCloseDropDown () {
        this._showDropDown = false;
    }

    handleOptionClick (event) {
        this.value = event.currentTarget.dataset.id;
        this.fireOnChangeEvent();
    }
}