"use client"

import { useState } from "react"
import { SortableActivityItem } from "./sortable-activity-item"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { useAppContext } from "@/context/app-context"
import Link from "next/link"

export function DraggableActivityList({ activities, onReorder }) {
  const { goals } = useAppContext()
  const [items, setItems] = useState(activities)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      // Create a new array with the item moved to the new position
      const newItems = [...items]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)

      setItems(newItems)
      onReorder(newItems)
    }
  }

  // Function to get goal title by ID
  const getGoalTitle = (goalId) => {
    if (!goalId) return null
    const goal = goals.find((g) => g.id === goalId)
    return goal ? goal.title : null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((activity) => (
            <SortableActivityItem
              key={activity.id}
              activity={activity}
              goalInfo={
                activity.goalId ? (
                  <Link
                    href={`/goals?highlight=${activity.goalId}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mt-1 inline-block"
                  >
                    Related to: {getGoalTitle(activity.goalId)}
                  </Link>
                ) : null
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
