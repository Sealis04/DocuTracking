import { actionTakenSchema, addRecordSchema, detailsSchema, endorseRecordSchema, filterSchema, remarksSchema } from "~/models/models";
import { createTRPCRouter, loggedInProcedure } from "../trpc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { addHours } from "date-fns";
import { localAction, localAdd, localCount, localData, localEndorse, localRemarks, localSpecific, localTop } from "~/actions/actions";

export const localDataRouter = createTRPCRouter({
    getLocalData:loggedInProcedure
    .input(filterSchema)
    .query(({ctx,input})=>localData(input)),
    getTop:loggedInProcedure
    .query(({ctx})=>localTop()),
    addRecord:loggedInProcedure
    .input(addRecordSchema)
    .mutation(({ctx,input})=>localAdd(input)),
    getTotal:loggedInProcedure
    .input(filterSchema)
    .query(({ctx,input})=> localCount(input)),
    updateEndorse:loggedInProcedure
    .input(endorseRecordSchema)
    .mutation(({ctx,input})=>localEndorse(input)),
    updateAction:loggedInProcedure
    .input(actionTakenSchema)
    .mutation(({ctx,input})=>localAction(input)),
    updateRemarks:loggedInProcedure
    .input(remarksSchema)
    .mutation(({ctx,input})=>localRemarks(input)),
    getSpecificRecord:loggedInProcedure
    .input(detailsSchema)
    .query(({ctx,input})=>localSpecific(input)),
    getListOfDocumentsEndorsed:loggedInProcedure
    .input(z.object({
        from:z.date(),
        to:z.date()
    }))
    .query(async ({ctx,input})=>{
        const list = await ctx.db.documents.findMany({
            select:{
                endorsedTo:true
            },
            where:{
                endorsedTo:{
                    not:null
                },
                endorsedDate:{
                    gte:new Date(input.from),
                    lt:addHours(new Date(input.to),23)
                }
            },
            distinct:['endorsedTo']
        })
        const result =  await Promise.all(list.map(async (listItem)=>{
            return await ctx.db.documents.findMany({
                select:{
                    endorsedTo:true,
                    endorsedDate:true,
                    recordUser:{
                        select:{
                            fName:true,
                            lName:true
                        }
                    },
                    recDate:true,
                    particulars:true
                },
                where:{
                    endorsedTo:listItem.endorsedTo,
                    endorsedDate:{
                        gte:new Date(input.from),
                        lt:addHours(new Date(input.to),23)
                    }
                },
                orderBy:{
                    endorsedTo:'asc'
                }
            })
        }))
        .then().catch(()=>{
            throw new Error('Error in getting list of documents endorsed');
        })

        return result
    }),
    })
