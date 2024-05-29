/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/search'], (currentRecord, search) => {

    const fetchCustomerCrossReference = (customer, items) => {
        if (!customer || !items.length) { return {}; }

        let customerCrossReferenceTable = {};

        const customerCrossReferenceSearch = search.create({
            type: 'customrecord_pla_ccf_customercrossrefere',
            filters: [
                ['isinactive', 'is', 'F'],
                'AND',
                ['custrecord_pla_ccf_customer', 'anyof', customer],
                'AND',
                ['custrecord_pla_ccf_item', 'anyof', items],
            ],
            columns: [
                search.createColumn({ name: 'internalid' }),
                search.createColumn({ name: 'custrecord_pla_ccf_item' }),
                search.createColumn({ name: 'custrecord_pla_ccf_primaryshiptoaddressc' }),
                search.createColumn({ name: 'custrecord_pla_ccf_itemdescription' }),
                search.createColumn({ name: 'custrecord_pla_ccf_customeritemnumber' }),
                search.createColumn({ name: 'custrecord_pla_ccf_customeritemdescripti' }),
                search.createColumn({ name: 'custrecord_pla_ccf_certificationitemnumb' }),
                search.createColumn({ name: 'custrecord_pla_ccf_minimumorderquantity' }),
                search.createColumn({ name: 'custrecord_pla_ccf_unitprice' }),
                search.createColumn({ name: 'custrecord_pla_ccf_warehouselocation' })
            ],
        });

        const customrecordPlaCcfCustomercrossrefereSearchPagedData = customerCrossReferenceSearch.runPaged({ pageSize: 1000 });
        for (let i = 0; i < customrecordPlaCcfCustomercrossrefereSearchPagedData.pageRanges.length; i++) {
            const customrecordPlaCcfCustomercrossrefereSearchPage = customrecordPlaCcfCustomercrossrefereSearchPagedData.fetch({ index: i });
            customrecordPlaCcfCustomercrossrefereSearchPage.data.forEach((result) => {
                let ccfId = result.getValue({ name: 'internalid' });
                let item = result.getValue({ name: 'custrecord_pla_ccf_item' });
                let primaryShipToAddressCode = result.getValue({ name: 'custrecord_pla_ccf_primaryshiptoaddressc' });
                let itemDescription = result.getValue({ name: 'custrecord_pla_ccf_itemdescription' });
                let customerItemNumber = result.getValue({ name: 'custrecord_pla_ccf_customeritemnumber' });
                let customerItemDescription = result.getValue({ name: 'custrecord_pla_ccf_customeritemdescripti' });
                let certificationItemNumber = result.getValue({ name: 'custrecord_pla_ccf_certificationitemnumb' });
                let minimumOrderQuantity = result.getValue({ name: 'custrecord_pla_ccf_minimumorderquantity' });
                let unitPrice = result.getValue({ name: 'custrecord_pla_ccf_unitprice' });
                let warehouseLocation = result.getValue({ name: 'custrecord_pla_ccf_warehouselocation' });
                customerCrossReferenceTable[item] = {
                    ccfId,
                    item,
                    primaryShipToAddressCode,
                    itemDescription,
                    customerItemNumber,
                    customerItemDescription,
                    certificationItemNumber,
                    minimumOrderQuantity,
                    unitPrice,
                    warehouseLocation
                };
            });
        }

        return customerCrossReferenceTable;
    }

    return {
        /**
         * @description
         * @param {Object} scriptContext 
         */
        fieldChanged: (scriptContext) => {
            try {
                // let { currentRecord, sublistId, fieldId } = scriptContext;
                // let ccfObj = {};
                // if (fieldId == 'entity') {
                //     let customer = currentRecord.getValue({ fieldId: 'entity' });
                //     console.log('customer', customer);
                //     ccfObj = fetchCustomerCrossReferenceOfCustomer(customer);
                //     console.log('ccfObj', ccfObj);
                // }
                // if (sublistId == 'item' && fieldId == 'item') {

                // }
            }
            catch (er) {
                console.log('er@fieldChanged', er.message);
            }
        },
        /**
         * @description
         * @param {Object} 
         */
        applyCCF: () => {
            try {
                console.log('Action', 'Test Apply CCF');
                let currentForm = currentRecord.get();
                let customer = currentForm.getValue({ fieldId: 'entity' });
                let items = [];
                let itemLineCount = currentForm.getLineCount({ sublistId: 'item' });
                for (let k = 0; k < itemLineCount; k++) {
                    let isCcfApplied = currentForm.getSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_applyccf', line: k });
                    if (isCcfApplied) {
                        let item = currentForm.getSublistValue({ sublistId: 'item', fieldId: 'item', line: k });
                        items.push(item);
                    }
                }
                console.log('items', items);
                let customerCrossReferenceTable = fetchCustomerCrossReference(customer, items);
                console.log('customerCrossReferenceTable', customerCrossReferenceTable);
                for (let s = 0; s < itemLineCount; s++) {
                    let isCcfApplied = currentForm.getSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_applyccf', line: s });
                    if (isCcfApplied) {
                        let item = currentForm.getSublistValue({ sublistId: 'item', fieldId: 'item', line: s });
                        if (customerCrossReferenceTable[item]) {
                            let line = currentForm.selectLine({ sublistId: 'item', line: s });
                            let primaryShipToAddressCode = customerCrossReferenceTable[item].primaryShipToAddressCode ? customerCrossReferenceTable[item].primaryShipToAddressCode : '';
                            let itemDescription = customerCrossReferenceTable[item].itemDescription ? customerCrossReferenceTable[item].itemDescription : '';
                            let customerItemNumber = customerCrossReferenceTable[item].customerItemNumber ? customerCrossReferenceTable[item].customerItemNumber : '';
                            let customerItemDescription = customerCrossReferenceTable[item].customerItemDescription ? customerCrossReferenceTable[item].customerItemDescription : '';
                            let certificationItemNumber = customerCrossReferenceTable[item].certificationItemNumber ? customerCrossReferenceTable[item].certificationItemNumber : '';
                            let minimumOrderQuantity = customerCrossReferenceTable[item].minimumOrderQuantity ? customerCrossReferenceTable[item].minimumOrderQuantity : '';
                            let unitPrice = customerCrossReferenceTable[item].unitPrice ? customerCrossReferenceTable[item].unitPrice : '';
                            let warehouseLocation = customerCrossReferenceTable[item].warehouseLocation ? customerCrossReferenceTable[item].warehouseLocation : '';
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_primaryshiptoaddressc', value: primaryShipToAddressCode });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_itemdescription', value: itemDescription });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_customeritemnumber', value: customerItemNumber });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_customeritemdescripti', value: customerItemDescription });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_certificationitemnumb', value: certificationItemNumber });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: minimumOrderQuantity });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: unitPrice });
                            currentForm.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_pla_ccf_warehouselocation', value: warehouseLocation });
                        }
                    }
                }
            }
            catch (er) {
                console.log('er@applyCCF', er.message);
            }
        }
    }
})