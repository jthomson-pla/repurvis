/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'], (record) => {

    return {
        /**
         * @description
         * @param {Object} scriptContext 
         */
        beforeLoad: (scriptContext) => {
            try {
                let { type, form, newRecord: { id: recId } } = scriptContext;
                log.debug('Input', { type, recId });
                form.clientScriptModulePath = './PLA_CS_CustomerCrossReference.js';
                form.getSublist({
                    id: 'item'
                }).addButton({
                    id: 'custpage_applyccf',
                    label: 'Apply CCF',
                    functionName: 'applyCCF'
                });
            }
            catch (er) {
                log.error('er@beforeLoad', er.message);
            }
        },
        /**
         * @description
         * @param {Object} scriptContext 
         */
        afterSubmit: (scriptContext) => {
            try {
                let { type, form, newRecord: { id: recId } } = scriptContext;
                log.debug('Input', { type, recId });
            }
            catch (er) {
                log.error('er@afterSubmit', er.message);
            }
        }
    }
})