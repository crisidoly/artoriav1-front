"use client";

import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { TaskCard } from "./TaskCard";
import { TaskColumn } from "./TaskColumn";

interface Task {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface TaskBoardProps {
    initialTasks: Task[];
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  // Strict Mode fix for Next.js SSR
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5, // Require slight storage to prevent accidental drags on clicks
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
      { id: 'todo', title: 'To Do' },
      { id: 'in-progress', title: 'In Progress' },
      { id: 'done', title: 'Done' },
  ];

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.sortable;
    const isOverTask = over.data.current?.sortable;

    if (!isActiveTask) return;

    // Dropping over another task
    if (isActiveTask && isOverTask) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
            
            if (tasks[activeIndex].status !== tasks[overIndex].status) {
                // Moving to different column
                const newTasks = [...tasks];
                newTasks[activeIndex].status = tasks[overIndex].status;
                return arrayMove(newTasks, activeIndex, overIndex);
            }

            // Creating a new array to trigger re-render
            return arrayMove(tasks, activeIndex, overIndex);
        });
    }

    // Dropping over a column (empty space)
    const isOverColumn = columns.some(col => col.id === overId);
    if (isActiveTask && isOverColumn) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            if (tasks[activeIndex].status !== overId) {
                const newTasks = [...tasks];
                newTasks[activeIndex].status = overId as Task['status'];
                // Move to end of that column visually (simple approach) or keep index
                return arrayMove(newTasks, activeIndex, activeIndex); 
            }
            return tasks;
        });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
  }

  if (!isMounted) return null;

  return (
    <div className="h-full w-full overflow-x-auto">
        <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <div className="flex gap-6 h-full min-w-[900px]">
            {columns.map((col) => (
                <div key={col.id} className="flex-1 min-w-[300px]">
                    <TaskColumn 
                        id={col.id} 
                        title={col.title} 
                        tasks={tasks.filter(t => t.status === col.id)} 
                    />
                </div>
            ))}
        </div>

        <DragOverlay>
            {activeId ? (
                <div className="opacity-80 rotate-2 cursor-grabbing">
                 <TaskCard task={tasks.find((t) => t.id === activeId)!} />
                </div>
            ) : null}
        </DragOverlay>
        </DndContext>
    </div>
  );
}
