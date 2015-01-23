Ext.define('Ux.field.MultiselectEmbedded', {
    extend: 'Ux.field.Multiselect',
    alias : 'widget.multiselectembeddedfield',
    config: {
        delimiter   : ',',
        mode        : 'MULTI',
        doneButton  : false,
        clearButton : false,
        minSelection: false,
        maxSelection: false
    },
    _list: null,
    _titleToolbar: null,
    _messageToolbar: null,

    /**
     * Builds the title toolbar.
     *
     * @private
     *
     * @return {Ext.Toolbar} The title toolbar.
     */
    buildTitleToolbar: function () {
        var me    = this,
            title = me.getLabel();

        this._titleToolbar = Ext.create('Ext.Toolbar', {
            itemId: 'titleToolbar',
            title: {
                title: title,
                style: 'font-size: 14px; line-height: 18px;',
            },
            layout: {
                pack: 'center',
                type: 'hbox'
            }
        });

        return this._titleToolbar;
    },

    /**
     * Builds the message toolbar.
     *
     * @private
     *
     * @return {Ext.Toolbar} The message toolbar.
     */
    buildMessageToolbar: function () {
        var me           = this,
            message      = '',
            minSelection = me.getMinSelection(),
            maxSelection = me.getMaxSelection();

        if (false !== minSelection) {
            message += 'You must select minimum ' + minSelection;
        }

        if (false !== maxSelection) {
            message += ('' === message ? 'You must select' : ' and') + ' maximum ' + maxSelection;
        }

        if (false !== minSelection || false !== maxSelection) {
            message += ' item(s).';
        }

        if ('' === message) {
            return null;
        }

        this._messageToolbar = Ext.create('Ext.Panel', {
            itemId: 'messageToolbar',
            html: message
        });

        return this._messageToolbar;
    },

    /**
     * Builds the list containing select options.
     *
     * @private
     *
     * @return {Ext.dataview.List} The list.
     */
    buildList: function () {
        var me = this;

        me._list = Ext.create('Ext.dataview.List', {
            mode: me.getMode(),
            store: me.getStore(),
            itemTpl: '<span class="x-list-label">{' + me.getDisplayField() + ':htmlEncode}</span>',
            scrollable: false,
            listeners: [{
                event: 'itemtap',
                fn: 'onListTap',
                scope: me
            }]
        });

        return me._list;
    },

    /**
     * Handles onDoneButtonTap event.
     *
     * @private
     */
    onDoneButtonTap: function () {
        var records = this._list.getSelection();
        this.setValue(records);
    },

    /**
     * Returns the list containing select options.
     *
     * @return {Ext.dataview.List} The list containing select options.
     */
    getList: function () {
        return this._list;
    },

    /**
     * Set the height to the list.
     */
    setListHeight: function () {
        var items       = this._list.getViewItems(),
            totalHeight = 0;

        for (var i = 0; i < items.length; i++) {
             totalHeight += items[i].element.dom.clientHeight;
        }

        this._list.setHeight(totalHeight);
    }
});
