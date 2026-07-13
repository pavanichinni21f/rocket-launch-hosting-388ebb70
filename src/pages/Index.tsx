import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Send, Sparkles, Shield, Zap, MessageSquare, Globe, Lock, Cpu, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import gsLogo from '@/assets/gslogo.png';

interface Msg { role: 'user' | 'assistant'; content: string; }

const demoReplies = [
  "Hi! I'm the GUIDESOFT AI Assistant. How can I help your business today?",
  "I can automate support, answer product questions, qualify leads, and integrate with your existing tools — all in seconds.",
  "Great question! Our AI is built for enterprise: SOC-ready, GDPR-aligned, and available 24/7 in 40+ languages.",
  "You can deploy me on your website, WhatsApp, or internal apps. Want a live demo? Email info@guideitsol.com.",
];

const features = [
  { Icon: Zap, title: 'Lightning Fast', desc: 'Sub-second responses powered by state-of-the-art LLMs.' },
  { Icon: Shield, title: 'Enterprise Security', desc: 'End-to-end encryption, RBAC, audit logs, and compliance built in.' },
  { Icon: Globe, title: 'Omnichannel', desc: 'Web, WhatsApp, Slack, Teams — one brain, every channel.' },
  { Icon: Cpu, title: 'Smart Automation', desc: 'Automate workflows, tickets, and repetitive tasks with AI agents.' },
  { Icon: Lock, title: 'Private & Secure', desc: 'Your data stays yours. No training on your conversations.' },
  { Icon: MessageSquare, title: 'Human Handoff', desc: 'Seamless escalation to live agents when nuance matters.' },
];

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: demoReplies[0] },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = demoReplies[(messages.length) % demoReplies.length] || demoReplies[1];
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0B3B6F] to-[#0A2540] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#4FC3F7,transparent_40%),radial-gradient(circle_at_80%_60%,#00E5FF,transparent_40%)]" />
        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-sm mb-6">
                <Sparkles className="h-4 w-4" /> Enterprise AI Assistant
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Meet the <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">GUIDESOFT AI</span> Assistant
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
                An intelligent conversational AI built by GUIDESOFT IT SOLUTIONS —
                powered by advanced language models to automate support, sales, and operations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-[#0A2540] hover:bg-white/90" asChild>
                  <a href="#chat">Try the Demo <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                  <a href="mailto:info@guideitsol.com"><Mail className="mr-2 h-4 w-4" /> Contact Sales</a>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-white/70">
                <span>🌐 www.guideitsol.com</span>
                <span>✉️ info@guideitsol.com</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
              id="chat"
            >
              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/5">
                  <img src={gsLogo} alt="Guidesoft" className="h-9 w-9" />
                  <div>
                    <p className="font-semibold">GUIDESOFT AI Assistant</p>
                    <p className="text-xs text-white/60">Online • Responds in seconds</p>
                  </div>
                </div>
                <div className="h-96 overflow-y-auto p-5 space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-cyan-400 text-[#0A2540] rounded-br-sm'
                          : 'bg-white/15 text-white rounded-bl-sm'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex justify-start">
                      <div className="bg-white/15 text-white px-4 py-3 rounded-2xl text-sm">
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
                <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Ask me anything…"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button onClick={send} className="bg-cyan-400 text-[#0A2540] hover:bg-cyan-300">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for the modern enterprise</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to deploy AI at scale — securely, reliably, beautifully.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-white flex items-center justify-center mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0A2540] to-[#0B3B6F] text-white">
        <div className="container mx-auto px-4 text-center">
          <Bot className="h-14 w-14 mx-auto mb-6 text-cyan-300" />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to deploy your AI Assistant?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Get in touch to see how GUIDESOFT IT SOLUTIONS can transform your customer experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-[#0A2540] hover:bg-white/90" asChild>
              <a href="mailto:info@guideitsol.com">Email info@guideitsol.com</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link to="/contact">Contact Form</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
