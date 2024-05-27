import { actionTakenSchema, addRecordSchema, detailsSchema, endorseRecordSchema, filterSchema, remarksSchema } from "~/models/models";
import { createTRPCRouter, loggedInProcedure } from "../trpc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { addHours } from "date-fns";
import { localData } from "~/actions/actions";

export const dataRouter = createTRPCRouter({
    getData:loggedInProcedure
    .input(filterSchema)
    .query(({ctx,input})=>{
        return ctx.db.documents.findMany({
            select:{
                id:true,
                ctrlNo:true,
                adminCtrlNo:true,
                recDate:true,
                particulars:true,
                recordUser:{
                    select:{
                        fName:true,
                        lName:true
                    }
                },
            },
            orderBy:{
                ...(input.header ? {[input.header]:input.isAsc ? 'asc':'desc'}:null)
            },
            where:{
                ctrlNo:input.controlNo != undefined && input.controlNo != '' ? {
                    equals:parseInt(input.controlNo)
                }:undefined,
                adminCtrlNo:input.adminControlNo != undefined && input.adminControlNo != '' ? {
                    equals:parseInt(input.adminControlNo)
                }:undefined,
                particulars:input.particulars != undefined && input.particulars != '' ? {
                    contains:input.particulars
                }:undefined
            },
            take:input.pageSize,
            skip:(input.currentPage-1)*input.pageSize
        });
    }),
    getTop:loggedInProcedure
    .query(({ctx})=>{
        return ctx.db.documents.findFirst({
            select:{
                ctrlNo:true,
            },
            orderBy:{
                ctrlNo:'desc'
            }
        });
    }),
    addRecord:loggedInProcedure
    .input(addRecordSchema)
    .mutation(({ctx,input})=>{
        return ctx.db.documents.create({
            data:{
                ctrlNo:parseInt(input.ctrlNo),
                adminCtrlNo:input.adminCtrlNo ? parseInt(input.adminCtrlNo):null,
                particulars:input.particulars,
                recDate:new Date(),
                recId:ctx.session.user.id
            }
        }).then()
        .catch((err)=>{
            if(err instanceof PrismaClientKnownRequestError){
                if(err.code == 'P2002'){
                    throw new Error('Admin Control Number already exists');
                }else{
                    throw new Error('Error in adding record');
                }
            }else{
                throw new Error('Error in adding record');
            }
        })
    }),
    getTotal:loggedInProcedure
    .input(filterSchema)
    .query(({ctx,input})=>{
        return ctx.db.documents.count({
            where:{
                ctrlNo:input.controlNo != undefined && input.controlNo != '' ? {
                    equals:parseInt(input.controlNo)
                }:undefined,
                adminCtrlNo:input.adminControlNo != undefined && input.adminControlNo != '' ? {
                    equals:parseInt(input.adminControlNo)
                }:undefined
            }
        });
    }),
    updateEndorse:loggedInProcedure
    .input(endorseRecordSchema)
    .mutation(({ctx,input})=>{
        return ctx.db.documents.update({
            where:{
                id:input.recordId,
                ctrlNo:input.ctrlNo
            },
            data:{
                endorsedTo:input.endorsedTo,
                endorsedDate:new Date(),
                endorsedID:ctx.session.user.id
            }
        }).then()
        .catch(()=>{
            throw new Error('Error in updating record');
        })
    }),
    updateAction:loggedInProcedure
    .input(actionTakenSchema)
    .mutation(({ctx,input})=>{
        return ctx.db.documents.update({
            where:{
                id:input.recordId,
                ctrlNo:input.ctrlNo
            },
            data:{
                actionTaken:input.actionTaken,
                actionDate:new Date(),
                actionID:ctx.session.user.id
            }
        }).then()
        .catch(()=>{
            throw new Error('Error in updating record');
        })
    }),
    updateRemarks:loggedInProcedure
    .input(remarksSchema)
    .mutation(({ctx,input})=>{
        return ctx.db.documents.update({
            where:{
                id:input.recordId,
                ctrlNo:input.ctrlNo
            },
            data:{
                remarks:input.remarks,
                remarksID:ctx.session.user.id,
                remarksDate:new Date()
            }
        }).then()
        .catch(()=>{
            throw new Error('Error in updating record');
        })
    }),
    getSpecificRecord:loggedInProcedure
    .input(detailsSchema)
    .query(({ctx,input})=>{
        return ctx.db.documents.findUnique({
            where:{
                id:input.recordId,
                ctrlNo:input.ctrlNo
            },
            select:{
                ctrlNo:true,
                adminCtrlNo:true,
                recordUser:{
                    select:{
                        fName:true,
                        lName:true
                    }
                },
                recDate:true,
                actionTaken:true,
                actionDate:true,
                endorsedTo:true,
                endorsedDate:true,
                remarks:true,
                remarksDate:true,
            }
        });
    }),
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
