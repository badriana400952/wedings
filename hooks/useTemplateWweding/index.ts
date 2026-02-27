import { ITemplateWeding } from "@/prisma/schema.types"
import axios from "axios"
import { useEffect, useState } from "react"


const useTemplateWedings = () => {
    const [templateWeding, setRemplateWeding] = useState({} as ITemplateWeding)
    const handleGetTemplateWeding = async (id: string) => {
        console.log({ id })
        try {
            const res = await axios.get(`/api/landing?id=${id}`)
            setRemplateWeding(res.data.response)
        } catch (error) {
            console.log(error)
        }
    }


    return {
        templateWeding,
        handleGetTemplateWeding
    }
}

export default useTemplateWedings