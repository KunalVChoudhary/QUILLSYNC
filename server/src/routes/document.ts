import { Router } from 'express'

import { 
    documentAuthorizationCheck, 
    documentOwnerAuthorizationCheck 
} from '../middleware/documentAuthorizationCheck.js'

import { userAuthorization } from '../middleware/userAuthorization.js'

import { 
    handleDocumentGetRequest, 
    handleDocumentCreateRequest, 
    handleDocumentPatchRequest, 
    handleDocumentDeleteRequest,
    handleAddingCollaboratorsRequest, 
    handleRemovingCollaboratorsRequest, 
    handleGetAuthorizedDocumentsListRequest 
} from '../controllers/document.js'

import { requestBodyInputValidate } from '../middleware/validate.js'

import { createDocumentSchema, updateDocumentCollaboratorSchema } from '../zodSchema/document.js'


export const route = Router()
//temporarily resolved routes naming issue for the get routes '/documents/user' and '/documents/:docId'; Rename routes better solution


//Document Authorized to access routes
route.get(
    '/documents/user', 
    userAuthorization, 
    handleGetAuthorizedDocumentsListRequest
)


//document routes
route.get(
    '/documents/:docId', 
    userAuthorization, 
    documentAuthorizationCheck, 
    handleDocumentGetRequest
)

//route to handle document create request
route.post(
    '/documents', 
    userAuthorization,
    requestBodyInputValidate(createDocumentSchema), 
    handleDocumentCreateRequest
)

//route to handle document patch request
route.patch(
    '/documents/:docId', 
    userAuthorization, 
    documentAuthorizationCheck,
    handleDocumentPatchRequest
)

//route to handle delete document
route.delete(
    '/documents/:docId', 
    userAuthorization, 
    documentOwnerAuthorizationCheck, 
    handleDocumentDeleteRequest
)


//collaborators route to add new collaborators
route.patch(
    '/documents/:docId/collaborator/add', 
    userAuthorization, 
    documentOwnerAuthorizationCheck, 
    requestBodyInputValidate(updateDocumentCollaboratorSchema),
    handleAddingCollaboratorsRequest
)

//collaborators route to remove collaborators
route.patch(
    '/documents/:docId/collaborator/remove', 
    userAuthorization, 
    documentOwnerAuthorizationCheck, 
    requestBodyInputValidate(updateDocumentCollaboratorSchema),
    handleRemovingCollaboratorsRequest
)