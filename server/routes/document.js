const {Router} = require('express')
const { documentAuthorizationCheck, documentOwnerAuthorizationCheck } = require('../middleware/documentAuthorizationCheck')
const { userAuthorization } = require('../middleware/userAuthorization')
const { handleDocumentGetRequest, handleDocumentCreateRequest, handleDocumentPatchRequest, handleDocumentDeleteRequest, } = require('../controllers/document')


const route = Router()

route.get('/documents/:docId', userAuthorization, documentAuthorizationCheck, handleDocumentGetRequest)

route.post('/documents', userAuthorization, handleDocumentCreateRequest)

route.patch('/documents/:docId', userAuthorization, documentAuthorizationCheck, handleDocumentPatchRequest)

route.delete('/documents/:docId', userAuthorization, documentOwnerAuthorizationCheck, handleDocumentDeleteRequest)

module.exports= route