import "server-only";
import { getAdminAccess } from "./auth";
import { getSupabaseClient } from "./supabase/client";

export type ActivityEntry={id:string;action:string;entityType:string;entityId?:string;details:Record<string,unknown>;actorRole:string;createdAt:string};

export async function recordActivity(action:string,entityType:string,entityId?:string,details:Record<string,unknown>={}){
  const supabase=getSupabaseClient();if(!supabase)return;
  try{const access=await getAdminAccess();await supabase.from("activity_log").insert({actor_id:access?.userId??null,actor_role:access?.role??"owner",action,entity_type:entityType,entity_id:entityId??null,details});}catch{}
}

export async function getActivityLog(limit=50):Promise<ActivityEntry[]>{
  const supabase=getSupabaseClient();if(!supabase)return [];
  const {data,error}=await supabase.from("activity_log").select("id,action,entity_type,entity_id,details,actor_role,created_at").order("created_at",{ascending:false}).limit(limit);if(error)return [];
  return (data??[]).map(row=>({id:row.id,action:row.action,entityType:row.entity_type,entityId:row.entity_id??undefined,details:row.details??{},actorRole:row.actor_role??"unknown",createdAt:row.created_at}));
}
