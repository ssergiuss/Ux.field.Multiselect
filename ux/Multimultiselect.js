Ext.define('Ux.field.Multimultiselect', {
    extend: 'Ux.field.Multiselect',
    alias: 'widget.multimultiselectfield',
    _multiselects: [],

    /**
     * Constructor.
     *
     * @param {Object} config
     */
    constructor: function (config) {
        var multiselectConfig;

        for (var i = 0; i < config.multiselects.length; i++) {
            multiselectConfig = config.multiselects[i];

            this._multiselects.push(Ext.create(
                'Ux.field.MultiselectEmbedded',
                multiselectConfig
            ));
        }

        this.callParent(arguments);
    },

    /**
     * Get tablet picker.
     *
     * @private
     *
     * @return {Ext.Panel} The list panel.
     */
    getTabletPicker: function () {
        var config = this.getDefaultTabletPickerConfig();

        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                left         : '5%',
                top          : '10%',
                modal        : true,
                cls          : Ext.baseCSSPrefix + 'select-overlay',
                layout       : 'vbox',
                hideOnMaskTap: true,
                width        : '90%',
                height       : '90%',
                items        : this.buildListPanelItems(),
                scrollable   : true
            }, config));
        }

        return this.listPanel;
    },

    /**
     * Builds the list panel items.
     *
     * @private
     *
     * @return {Array} The list panel items.
     */
    buildListPanelItems: function () {
        var listPanelItems = [],
            multiselect;

        for (var i = 0; i < this._multiselects.length; i++) {
            multiselect = this._multiselects[i];

            listPanelItems.push(multiselect.buildTitleToolbar());
            listPanelItems.push(multiselect.buildMessageToolbar());
            listPanelItems.push(multiselect.buildList());
        }

        listPanelItems.push(this.buildBottomToolbar());

        return listPanelItems;
    },

    /**
     * Handles onChange event.
     *
     * @private
     *
     * @param {Ext.field.Input} component
     * @param {String}          newValue
     * @param {String}          oldValue
     */
    onChange: function (component, newValue, oldValue) {
        var old = this.convertValue(
            oldValue,
            this.getDisplayField(),
            this.getValueField()
        );

        this.fireEvent('change', this, this.getValue(), old);
    },

    /**
     * Shows the picker for the select field.
     */
    showPicker: function () {
        var listPanel, value, multiselect, records;

        if (this.getReadOnly()) {
            return;
        }

        this.isFocused = true;

        listPanel = this.getTabletPicker();
        value = this.getValue();

        if (!listPanel.getParent()) {
            Ext.Viewport.add(listPanel);
        }

        if (value) {
            for (var i = 0; i < this._multiselects.length; i++) {
                multiselect = this._multiselects[i];

                if (value[i]) {
                    records = multiselect.getRecordsFromValue(value[i]);
                    multiselect._list.select(records, null, true);
                } else {
                    multiselect._list.deselectAll();
                }
            }
        }

        listPanel.show();

        for (var i = 0; i < this._multiselects.length; i++) {
            this._multiselects[i].setListHeight();
        }
    },

    /**
     * Handles onDoneButtonTap event.
     *
     * @private
     */
    onDoneButtonTap: function () {
        var records = [],
            multiselect;

        for (var i = 0; i < this._multiselects.length; i++) {
            multiselect = this._multiselects[i];

            multiselect.onDoneButtonTap();
            records.push(multiselect.getValue());
        }

        this.setValue(records);

        this.superclass.superclass.onListTap.call(this);
    },

    /**
     * Applies value.
     *
     * @private
     *
     * @param  {Array} value
     * @return {Array}
     */
    applyValue: function (value) {
        return this.getValueFromRecords(value, this.getValueField());
    },

    /**
     * Updates value.
     *
     * @private
     *
     * @param {Array} newValue
     * @param {Array} oldValue
     */
    updateValue: function (newValue, oldValue) {
        var value = this.convertValue(
            newValue,
            this.getValueField(),
            this.getDisplayField()
        );

        value = [].concat.apply([], value).join(this.getDelimiter());
        if (',' === value[0]) {
            value = value.slice(1);
        }

        this.superclass.superclass.superclass.updateValue.call(this, [value]);
    },

    /**
     * Converts value.
     *
     * @private
     *
     * @param  {Array}  value
     * @param  {String} fieldIn
     * @param  {String} fieldOut
     * @return {Array}
     */
    convertValue: function (value, fieldIn, fieldOut) {
        var out = [],
            multiselect;

        if (value) {
            for (var i = 0; i < this._multiselects.length; i++) {
                multiselect = this._multiselects[i];

                out.push(multiselect.convertValue(
                    value[i],
                    multiselect.getValueField(),
                    multiselect.getDisplayField()
                ));
            }
        }

        return out;
    },

    /**
     * Returns the value in array form from records.
     *
     * @private
     *
     * @param  {Array} value
     * @return {Array}
     */
    getValueFromRecords: function (value) {
        var out = [],
            multiselect;

        if (value) {
            for (var i = 0; i < this._multiselects.length; i++) {
                multiselect = this._multiselects[i];

                out.push(multiselect.getValueFromRecords(
                    value[i],
                    multiselect.getValueField()
                ));
            }
        }

        return out;
    },

    /**
     * Returns records from value.
     *
     * @private
     *
     * @param  {Array}            value
     * @return {Ext.data.Model[]}
     */
    getRecordsFromValue: function (value) {
        return null;
    },

    /**
     * Returns the current selected instances.
     *
     * @return {Ext.data.Model[]} An array of Records.
     */
    getSelection: function () {
        return null;
    },

    /**
     * Returns the number of selections.
     *
     * @return {Number} The number of selections.
     */
    getSelectionCount: function () {
        return null;
    },

    /**
     * Called when the internal {@link #store}'s data has changed.
     *
     * @param  {Ext.data.Store} store
     * @return {Null}
     */
    onStoreDataChanged: function (store) {
        return null;
    }
});
