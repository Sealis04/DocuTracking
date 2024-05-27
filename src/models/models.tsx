import { z } from "zod";

const formSchema = z.object({
    username:z.string().min(3,'Required'),
    password:z.string().min(5,'Required'),
})

const userDetailsSchema = z.object({
    id:z.number(),
    name:z.string(),
    username:z.string(),
    resetPass:z.boolean(),
})

export type userDetails = z.infer<typeof userDetailsSchema>

const tableDetailsSchema = z.object({
  id:z.number(),
  ctrlNo: z.number(),
  adminCtrlNo: z.number().nullable(),
  particulars: z.string(),
  recDate: z.date(),
  recordUser: z.object({
    fName: z.string(),
    lName: z.string(),
  }),
})
const localTableDetailsSchema = z.object({
  id:z.number(),
  ctrlNo: z.number(),
  adminCtrlNo: z.number().nullable(),
  particulars: z.string(),
  recDate: z.string(),
  recordUser: z.object({
    fName: z.string(),
    lName: z.string(),
  }),
})
export const addRecordSchema = z.object({
  ctrlNo:z.string(),
  adminCtrlNo:z.string().optional(),
  particulars:z.string(),
})
export type addRecord = z.infer<typeof addRecordSchema>
const filterSchema = z.object({
  header:z.string().nullable(),
  isAsc:z.boolean(),
  controlNo:z.string().optional(),
  adminControlNo:z.string().optional(),
  particulars:z.string().optional(),
  pageSize:z.number(),
  currentPage:z.number(),
})

export const endorseRecordSchema = z.object({
  recordId:z.number(),
  ctrlNo:z.number(),
  endorsedTo:z.string(),
})

export type endorseRecord = z.infer<typeof endorseRecordSchema>
export const actionTakenSchema = z.object({
  recordId:z.number(),
  ctrlNo:z.number(),
  actionTaken:z.string(),
})
export type actionTaken = z.infer<typeof actionTakenSchema>;
export const remarksSchema = z.object({
  recordId:z.number(),
  ctrlNo:z.number(),
  remarks:z.string(),
})
export type remarks = z.infer<typeof remarksSchema>
export const detailsSchema = z.object({
  recordId:z.number(),
  ctrlNo:z.number(),
})
export type details = z.infer<typeof detailsSchema>
export type filter = z.infer<typeof filterSchema>
export type tableDetails = z.infer<typeof tableDetailsSchema>
export type localTableDetails= z.infer<typeof localTableDetailsSchema>
const listDocumentSchema = z.object({
  particulars: z.string(),
  endorsedTo: z.string().nullable(),
  recDate: z.date(),
  endorsedDate:z.date().nullable(),
  recordUser: z.object({
    fName: z.string(),
    lName: z.string(),
  }),
});

export type listDocument = z.infer<typeof listDocumentSchema>
export {formSchema, filterSchema}