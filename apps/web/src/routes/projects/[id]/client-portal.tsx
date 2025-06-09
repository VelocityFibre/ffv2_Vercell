import { Component } from "solid-js"
import { useParams } from "@solidjs/router"
import { ClientProgressPortal } from "../../../components/workflow"

const ClientPortalPage: Component = () => {
  const params = useParams()
  
  // Mock client ID - in real app this would come from auth context
  const clientId = "client-456"
  
  return (
    <div class="container mx-auto px-4 py-8">
      <ClientProgressPortal 
        projectId={params.id} 
        clientId={clientId}
      />
    </div>
  )
}

export default ClientPortalPage