import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

interface Message { id: string; from: 'me' | 'them'; text: string; at: number; }

const seed: Message[] = [
  { id: 'a', from: 'them', text: 'Hey! Welcome to KSFoundation support.', at: Date.now() - 60_000 },
  { id: 'b', from: 'me', text: 'Hi — I have a question about my hosting plan.', at: Date.now() - 45_000 },
  { id: 'c', from: 'them', text: 'Of course, happy to help. What plan are you on?', at: Date.now() - 30_000 },
];

export default function Messages() {
  const [msgs, setMsgs] = useState<Message[]>(seed);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = () => {
    if (!text.trim()) return;
    const mine: Message = { id: crypto.randomUUID(), from: 'me', text: text.trim(), at: Date.now() };
    setMsgs((m) => [...m, mine]);
    setText('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          from: 'them',
          text: 'Got it — let me check that for you right now.',
          at: Date.now(),
        },
      ]);
    }, 1500 + Math.random() * 800);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Messages</h1>
        <Card className="flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.from === 'them' && (
                    <Avatar className="h-8 w-8"><AvatarFallback>KS</AvatarFallback></Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      m.from === 'me'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8"><AvatarFallback>KS</AvatarFallback></Avatar>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
          <div className="border-t p-3 flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message..."
            />
            <Button onClick={send} size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
