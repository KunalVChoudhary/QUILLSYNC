const {Router} = require('express')
const { documentAuthorizationCheck, documentOwnerAuthorizationCheck } = require('../middleware/documentAuthorizationCheck')
const { userAuthorization } = require('../middleware/userAuthorization')
const { handleDocumentGetRequest, handleDocumentCreateRequest, handleDocumentPatchRequest, handleDocumentDeleteRequest, handleAddingCollaboratorsRequest, handleRemovingCollaboratorsRequest, handleGetAuthorizedDocumentsListRequest, } = require('../controllers/document')


const route = Router()
//temporarily resolved routes naming issue for the get routes '/documents/user' and '/documents/:docId'; Rename routes better solution


//Document Authorized to access routes
route.get('/documents/user', userAuthorization, handleGetAuthorizedDocumentsListRequest)


//document routes
route.get('/documents/:docId', userAuthorization, documentAuthorizationCheck, handleDocumentGetRequest)

route.post('/documents', userAuthorization, handleDocumentCreateRequest)

route.patch('/documents/:docId', userAuthorization, documentAuthorizationCheck, handleDocumentPatchRequest)

route.delete('/documents/:docId', userAuthorization, documentOwnerAuthorizationCheck, handleDocumentDeleteRequest)


//collaborators routes
route.patch('/documents/:docId/collaborator/add', userAuthorization, documentOwnerAuthorizationCheck, handleAddingCollaboratorsRequest)

route.patch('/documents/:docId/collaborator/remove', userAuthorization, documentOwnerAuthorizationCheck, handleRemovingCollaboratorsRequest)

module.exports= route