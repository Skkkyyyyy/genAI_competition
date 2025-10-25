import { supabase } from '../../../lib/frontend_supa';

export async function insertMessage(user_id: string, question:string, response:string) {
    try{
        const {data, error} = await supabase
            .from('messages')
            .insert([{user_id, question, response}])
            .select();
        console.log('Message inserted:', data);
        if (error) throw error;
        // return the inserted row (or rows)
        return data;
    }
    catch (error) {
        console.error('Error inserting message:', error);
        return null;
    }
}

export async function deleteMessage(user_id: string, message_id: string) {
    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('user_id', user_id)
            .eq('message_id', message_id);
        if (error) throw error;
        console.log('Message deleted:', message_id);
        return true;
    } catch (err) {
        console.error('Error deleting message:', err);
        return false;
    }
}


/*
export async function deleteMessage(user_id:string, message_id:string){
    try{
        const {error} = await supabase 
            .from('messages')
            .delete()
            .eq('user_id',user_id)
            .eq('message_id',message_id)
        if (error) throw error;
    }
}
    */

/*
const deleteMessage = async (user_id: string, message_id: string) => {
    try{
        const result = await client.query(
            'DELETE FROM messages WHERE user_id = $1 AND message_id = $2 RETURNING message_id',
            [user_id, message_id]
        );
        console.log('Message deleted:', result.rows[0]);
    }catch (error){
        console.error('Error deleting message:', error);
    }
}
const checkMessage = async (user_id: string, message_id:string) => {
    try{
        const result = await client.query(
            'SELECT * FROM message WHERE user_id = $1 AND message_id = $2',
            [user_id, message_id]
        );
        console.log('Message found:', result.rows[0]);
    }catch (error){
        console.error('Error finding message:', error);
    }
}
*/

export default function HandleSaveRoutePlaceholder() {
  return null
}