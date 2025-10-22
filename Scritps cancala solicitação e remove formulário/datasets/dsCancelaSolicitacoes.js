function createDataset(fields, constraints, sortFields) {
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch(e) {
		return processErrorResult(e, constraints);
	}
}
function callService(fields, constraints, sortFields) {
	var serviceData = data();
	var params = serviceData.inputValues;
	var assigns = serviceData.inputAssignments;
	verifyConstraints(serviceData.inputValues, constraints);
	var serviceHelper = ServiceManager.getService(serviceData.fluigService);
	var serviceLocator = serviceHelper.instantiate(serviceData.locatorClass);
	var service = serviceLocator.getWorkflowEngineServicePort();
	var response = service.cancelInstance(getParamValue(params.username, assigns.username), getParamValue(params.password, assigns.password), 
		getParamValue(params.companyId, assigns.companyId), getParamValue(params.processInstanceId, assigns.processInstanceId), 
		getParamValue(params.userId, assigns.userId), getParamValue(params.cancelText, assigns.cancelText)
		);
	return response;
}
function defineStructure() {
		addColumn('response');
}
function onSync(lastSyncDate) {
	var serviceData = data();
	var synchronizedDataset = DatasetBuilder.newDataset();
	try {
		var resultDataset = processResult(callService());
		if (resultDataset != null) {
			var values = resultDataset.getValues();
			for (var i = 0; i < values.length; i++) {
				synchronizedDataset.addRow(values[i]);
			}
		}
	} catch(e) {
		log.info('Dataset synchronization error : ' + e.message);
	}
	return synchronizedDataset;
}
function verifyConstraints(params, constraints) {
	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			try {
				params[constraints[i].fieldName] = JSON.parse(constraints[i].initialValue);
			} catch(e) {
				params[constraints[i].fieldName] = constraints[i].initialValue;
			}
		}
	}
}
function processResult(result) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("response");
	dataset.addRow([result]);
	return dataset;
}
function processErrorResult(error, constraints) {
	var dataset = DatasetBuilder.newDataset();
	var params = data().inputValues;
verifyConstraints(params, constraints);
dataset.addColumn('error');
	dataset.addColumn('processInstanceId');
	dataset.addColumn('password');
	dataset.addColumn('companyId');
	dataset.addColumn('cancelText');
	dataset.addColumn('userId');
	dataset.addColumn('username');
	var processInstanceId = isPrimitive(params.processInstanceId) ? params.processInstanceId : JSONUtil.toJSON(params.processInstanceId);
	var password = isPrimitive(params.password) ? params.password : JSONUtil.toJSON(params.password);
	var companyId = isPrimitive(params.companyId) ? params.companyId : JSONUtil.toJSON(params.companyId);
	var cancelText = isPrimitive(params.cancelText) ? params.cancelText : JSONUtil.toJSON(params.cancelText);
	var userId = isPrimitive(params.userId) ? params.userId : JSONUtil.toJSON(params.userId);
	var username = isPrimitive(params.username) ? params.username : JSONUtil.toJSON(params.username);
	dataset.addRow([error.message, processInstanceId, password, companyId, cancelText, userId, username]);
	return dataset;
}
function getParamValue(param, assignment) {
	if (assignment == 'VARIABLE') {
		return getValue(param);
	} else if (assignment == 'NULL') {
		return null;
	}
	return param;
}
function hasValue(value) {
	return value !== null && value !== undefined;
}
function isPrimitive(value) {
	return ((typeof value === 'string') || value.substring !== undefined) || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'undefined';
}

function getObjectFactory(serviceHelper) {
	var objectFactory = serviceHelper.instantiate("com.totvs.technology.ecm.workflow.ws.ObjectFactory");
	return objectFactory;
}


function data() {
	return {
  "fluigService" : "ECMWorkflowEngineService",
  "operation" : "cancelInstance",
  "soapService" : "ECMWorkflowEngineServiceService",
  "portType" : "WorkflowEngineService",
  "locatorClass" : "com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService",
  "portTypeMethod" : "getWorkflowEngineServicePort",
  "parameters" : [ ],
  "inputValues" : {
    "processInstanceId" : 748205,
    "password" : "naJBF3NvZN3x3Ocg",
    "companyId" : 1,
    "cancelText" : "Cancelado via evento de processo.",
    "userId" : "admin",
    "username" : "admin"
  },
  "inputAssignments" : {
    "processInstanceId" : "VALUE",
    "password" : "VALUE",
    "companyId" : "VALUE",
    "cancelText" : "VALUE",
    "userId" : "VALUE",
    "username" : "VALUE"
  },
  "outputValues" : { },
  "outputAssignments" : { },
  "extraParams" : {
    "enabled" : false
  }
}
}
 function stringToBoolean(param) { if(typeof(param) === 'boolean') {  return param;  }  if (param == null || param === 'null') {  return false;  }  switch(param.toLowerCase().trim()) {  case 'true': case 'yes': case '1': return true;  case 'false': case 'no': case '0': case null: return false;  default: return Boolean(param);  }  } 