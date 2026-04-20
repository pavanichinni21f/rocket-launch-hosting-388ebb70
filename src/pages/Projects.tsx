import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

type Status = 'todo' | 'in_progress' | 'done';
interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
}

const initial: Task[] = [
  { id: '1', title: 'Design landing hero', description: 'New 21st.dev style hero', status: 'todo', priority: 'high' },
  { id: '2', title: 'Wire UPI checkout', description: '3-step verification flow', status: 'in_progress', priority: 'high' },
  { id: '3', title: 'Realtime messages', description: 'Typing indicators', status: 'in_progress', priority: 'medium' },
  { id: '4', title: 'Dashboard analytics', description: 'CountUp + Recharts', status: 'done', priority: 'medium' },
  { id: '5', title: 'Particle overlay', description: 'Canvas particles', status: 'done', priority: 'low' },
];

const columns: { id: Status; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

function SortableCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const tone =
    task.priority === 'high'
      ? 'destructive'
      : task.priority === 'medium'
      ? 'default'
      : 'secondary';
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">{task.title}</CardTitle>
            <Badge variant={tone as any}>{task.priority}</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">{task.description}</CardContent>
      </Card>
    </div>
  );
}

export default function Projects() {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = String(over.id);
    const overColumn = columns.find((c) => c.id === overId)?.id;
    const overTask = tasks.find((t) => t.id === overId);
    const targetStatus: Status = overColumn ?? overTask?.status ?? activeTask.status;

    if (activeTask.status !== targetStatus) {
      setTasks((cur) => cur.map((t) => (t.id === active.id ? { ...t, status: targetStatus } : t)));
      return;
    }
    if (overTask && active.id !== over.id) {
      setTasks((cur) => {
        const oldIdx = cur.findIndex((t) => t.id === active.id);
        const newIdx = cur.findIndex((t) => t.id === over.id);
        return arrayMove(cur, oldIdx, newIdx);
      });
    }
  };

  const active = tasks.find((t) => t.id === activeId);

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Drag tasks across columns to update status.</p>
          </div>
          <Button><Plus className="mr-2 h-4 w-4" />New Task</Button>
        </motion.div>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="grid gap-4 md:grid-cols-3">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} id={col.id} className="bg-muted/40 rounded-lg p-3 min-h-[400px]">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">{col.title}</h3>
                    <Badge variant="outline">{colTasks.length}</Badge>
                  </div>
                  <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy} id={col.id}>
                    <div className="space-y-2 min-h-[300px]">
                      {colTasks.map((t) => <SortableCard key={t.id} task={t} />)}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
          <DragOverlay>{active ? <SortableCard task={active} /> : null}</DragOverlay>
        </DndContext>
      </div>
    </AppLayout>
  );
}
