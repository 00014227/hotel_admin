'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient'; 
import { useSelector } from 'react-redux'; // Assuming you store admin info in Redux!

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const { userTable } = useSelector(state => state.auth); // Logged-in admin info
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (initialUserId) {
      handleSelectUser(initialUserId);
    }
  }, [initialUserId]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('user_id, user(name, email)')
      .neq('sender_role', 'admin') 
      .order('created_at', { ascending: false });
    console.log(data, 'ddddd')
    if (error) {
      console.error(error);
    } else {
      const uniqueUsers = Array.from(
        new Map(data.map(item => [item.user_id, item])).values()
      );
      setUsers(uniqueUsers);
    }
  };

  const handleSelectUser = async (userId) => {
    setSelectedUser(userId);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !userTable?.id) return

    const { error } = await supabase.from('messages').insert([
      {
        user_id: selectedUser,
        sender_id: userTable.id,         // Admin ID
        sender_role: 'admin',       // Admin role
        message: newMessage,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      console.log(`Notification sent to user ${selectedUser}: "${newMessage}"`);
      setNewMessage('');
      handleSelectUser(selectedUser); 
    }
  };

  return (
    <div className="flex min-h-[80vh] bg-gray-100 rounded-xl overflow-hidden shadow p-4">
      {/* Users */}
      <div className="w-1/3 bg-white p-4 border-r">
        <h2 className="font-bold mb-4">Users</h2>
        {users.map((user) => (
          <div
            key={user.user_id}
            onClick={() => handleSelectUser(user.user_id)}
            className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-200 ${
              selectedUser === user.user_id ? 'bg-gray-300' : ''
            }`}
          >
            <p className="font-semibold">{user.users?.name || 'Unnamed User'}</p>
            <p className="text-xs text-gray-500">{user.users?.email}</p>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-[70%] ${
                    msg.sender_role === 'admin' ? 'ml-auto bg-red-200' : 'bg-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-[10px] text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="flex mt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-l"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="bg-red-500 text-white p-2 rounded-r"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-10 text-center">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}
