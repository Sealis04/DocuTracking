/* eslint-disable @typescript-eslint/no-unsafe-return */
"use server";
import { actionTaken, addRecord, details, endorseRecord, filter, formSchema, remarks, userDetails} from "~/models/models";
import * as bcrypt from "bcrypt";
import { db } from "~/server/db";
import { UseGetSession } from "~/lib/serverutils";
import { redirect } from "next/navigation";
import { readFile, readFileSync, writeFileSync } from "fs";

export async function login(
  prevState: { isLoggedIn: boolean; message: string } | undefined,
  formData: FormData,
) {
  if(formData.get("username") === '' || formData.get("password") === ''){
    return {
      isLoggedIn: false,
      message: "Please fill in all fields",
    };
  }
  const validatedField = formSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedField.success) {
    return {
      isLoggedIn: false,
      message: "Invalid login details, please try again",
    };
  }

  const { username, password } = validatedField.data;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access

  const user = await db.user.findUnique({
    where: {
      userName: username,
    },
  });
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (bcrypt.compareSync(password, user.password)) {
      const session = await UseGetSession();
      session.user = {
        id: user.id,
        username: user.userName,
        name: user.fName + " " + user.lName,
        resetPass:user.isReset
      };
      await session.save();
      return { isLoggedIn: true, message: "Login Success" };
    } else {
      return {
        isLoggedIn: false,
        message: "Username/Password incorrect, please try again",
      };
    }
  }
  return {
    isLoggedIn: false,
    message: "Username/Password incorrect, please try again",
  };
}

export async function logout(){
  const session = await UseGetSession();
  session.destroy();
  redirect('/')
  return;
}
export async function resetDetails(
  prevState: { isSuccess: boolean; message: string } | undefined,
  formData: FormData,
) {
  if(formData.get("username") === '' || formData.get("password") === ''){
    return {
      isSuccess: false,
      message: "Please fill in all fields",
    };
  }
  const validatedField = formSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedField.success) {
    return {
      isSuccess: false,
      message: "Invalid login details, please try again",
    };
  }

  const { username, password } = validatedField.data;

  const user = await db.user.findUnique({
    where: {
      userName: username,
    },
  });
  if(user){
    return {
      isSuccess: false,
      message: "Username already exists, please try again",
    };
  }
    const session = await UseGetSession();
    await db.user.update({
      where:{
        id:session.user.id
      },
      data:{
        userName:username,
        password:bcrypt.hashSync(password,10),
        isReset:true
      }
    })
    .then(()=>{
      session.destroy();
      redirect('/')
    })

}

export async function localLogin(
  prevState: { isLoggedIn: boolean; message: string } | undefined,
  formData: FormData,
){
  if(formData.get("username") === '' || formData.get("password") === ''){
    return {
      isLoggedIn: false,
      message: "Please fill in all fields",
    };
  }
  const validatedField = formSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!validatedField.success) {
    return {
      isLoggedIn: false,
      message: "Invalid login details, please try again",
    };
  }

  const { username, password } = validatedField.data;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const data = readFileSync("usercredentials.json", 'utf8');
  const parsedData = JSON.parse(data) as [{
    username: string,
    password: string,
    fName: string,
    mName: string,
    lName: string,
    resetPass: boolean
  }];
  const user = parsedData.find((user) => user.username === username);
  if(user == undefined){
    return {
      isLoggedIn: false,
      message: "Username/Password incorrect, please try again",
    };
  }else{
    if(password == user.password){
      const session = await UseGetSession();
      session.user = {
        id: 1,
        username: user.username,
        name: user.fName + " " + user.lName,
        resetPass:user.resetPass
      };
      await session.save();
      return {
        isLoggedIn: true,
        message: "User Logged In",
      };
    }else{
      return {
        isLoggedIn: false,
        message: "Username/Password incorrect, please try again",
      };
    }
  }
}


export async function localData(data:filter){
  const storedData = readFileSync("data.json", 'utf8');
  const parsedData = JSON.parse(storedData) as {
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }[];
  let returnArray = parsedData;
  if(data.controlNo != undefined && data.controlNo != ''){
    returnArray = returnArray.filter((record) => record.ctrlNo.toString().includes(data.controlNo ?? ''));
  }
  if(data.adminControlNo != undefined && data.adminControlNo != ''){
    returnArray =  returnArray.filter((record) => record.adminCtrlNo?.toString().includes(data.adminControlNo ?? ''));
  }

  if(data.particulars != undefined && data.particulars != ''){
    returnArray = returnArray.filter((record) => record.particulars.toLowerCase().includes(data.particulars?.toLowerCase() ?? ''));
  }

  if(data.header != null){
    returnArray.sort((a,b) => {
      if(data.isAsc){
        return a[data.header] > b[data.header] ? 1:-1;
      }else{
        return a[data.header] < b[data.header] ? 1:-1;
      }
    })
  }
  return returnArray.slice((data.currentPage - 1) * data.pageSize, (data.currentPage) * data.pageSize);
}

export async function localCount(data:filter){
  const storedData = readFileSync("data.json", 'utf8');
  const parsedData = JSON.parse(storedData) as {
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }[]
  let returnArray = parsedData;
  if(data.controlNo != undefined && data.controlNo != ''){
    returnArray = returnArray.filter((record) => record.ctrlNo.toString().includes(data.controlNo ?? ''));
  }
  if(data.adminControlNo != undefined && data.adminControlNo != ''){
    returnArray =  returnArray.filter((record) => record.adminCtrlNo?.toString().includes(data.adminControlNo ?? ''));
  }

  if(data.particulars != undefined && data.particulars != ''){
    returnArray = returnArray.filter((record) => record.particulars.toLowerCase().includes(data.particulars?.toLowerCase() ?? ''));
  }

  if(data.header != null){
    returnArray.sort((a,b) => {
      if(data.isAsc){
        return a[data.header] > b[data.header] ? 1:-1;
      }else{
        return a[data.header] < b[data.header] ? 1:-1;
      }
    })
  }
  return returnArray.length
}

export async function localAdd(data:addRecord){
  const storedData = readFileSync("data.json", 'utf8');
  const session = await UseGetSession();
  const parsedData = JSON.parse(storedData) as [{
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }];
  parsedData.push({
    adminCtrlNo:data.adminCtrlNo ? parseInt(data.adminCtrlNo):null,
    ctrlNo:parseInt(data.ctrlNo),
    id:parsedData.length + 1,
    particulars:data.particulars,
    recDate:new Date().toISOString(),
    recordUser:{
      fName:session.user.name.split(" ")[0] ?? 'Sealis',
      lName:session.user.name.split(" ")[1] ?? 'Sample'
    },
    endorsedTo:null,
    endorsedDate:null,
    actionTaken:null,
    actionDate:null,
    remarks:null,
    remarksDate:null
  })
  writeFileSync("data.json", JSON.stringify(parsedData));
}

export async function localTop(){
  const storedData = readFileSync("data.json", 'utf8');
  const parsedData = JSON.parse(storedData) as [{
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }];
  return parsedData[parsedData.length - 1]?.id
}

export async function localSpecific(data:details){
  const storedData = readFileSync("data.json", 'utf8');
  const parsedData = JSON.parse(storedData) as [{
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }];
  return parsedData.find((record) => record.id == data.recordId && record.ctrlNo == data.ctrlNo);
}

export async function localEndorse(data:endorseRecord){
  const storedData = readFileSync("data.json", 'utf8');
  const session = await UseGetSession();
  const parsedData = JSON.parse(storedData) as [{
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }];
  const record = parsedData.find((record) => record.id == data.recordId && record.ctrlNo == data.ctrlNo);
  if(record == undefined){
    throw new Error('Record not found');
  }
  record.endorsedTo = data.endorsedTo;
  record.endorsedDate = new Date().toISOString();
  writeFileSync("data.json", JSON.stringify(parsedData));

}

export async function localRemarks(data:remarks){
  const storedData = readFileSync("data.json", 'utf8');
  const parsedData = JSON.parse(storedData) as [{
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }];
  const record = parsedData.find((record) => record.id == data.recordId && record.ctrlNo == data.ctrlNo);
  if(record == undefined){
    throw new Error('Record not found');
  }
  record.remarks = data.remarks;
  record.remarksDate = new Date().toISOString();
  writeFileSync("data.json", JSON.stringify(parsedData));
}

export async function localAction(data:actionTaken){
  const storedData = readFileSync("data.json", 'utf8');
  const parsedData = JSON.parse(storedData) as [{
    id:number,
    ctrlNo:number,
    adminCtrlNo:number | null,
    particulars:string,
    recDate:string,
    recordUser:{
      fName:string,
      lName:string
    },
    endorsedTo:string | null,
    endorsedDate:string | null,
    actionTaken:string | null,
    actionDate:string | null,
    remarks:string | null,
    remarksDate:string | null
  }];
  const record = parsedData.find((record) => record.id == data.recordId && record.ctrlNo == data.ctrlNo);
  if(record == undefined){
    throw new Error('Record not found');
  }
  record.actionTaken = data.actionTaken;
  record.actionDate = new Date().toISOString();
  writeFileSync("data.json", JSON.stringify(parsedData));
}