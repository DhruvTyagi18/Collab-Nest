import { ElementRef, useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ListWithCards } from '@/types';
import { ListHeader } from './list-header';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';

type ListItemProps = {
  data: ListWithCards;
  index: number;
  refetchLists: any;
};

export function ListItem({ data, index, refetchLists }: ListItemProps) {
  const textAreaRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(data.description || '');

  // Use the trpc mutation hook
  const updateDescriptionMutation = trpc.list.updateDescription.useMutation();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDescriptionSave = async () => {
    try {
      // Trigger the mutation to update the description in the database
      await updateDescriptionMutation.mutateAsync({
        id: data.id,
        description,
      });

      toast.success('Description updated successfully!');
      // Refetch lists if necessary
      refetchLists();
    } catch (error) {
      console.error('Failed to update description:', error);
    } finally {
      disableEditing();
    }
  };

  return (
    <li className="w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader data={data} onAddCard={enableEditing} refetchLists={refetchLists} />
        {/* Description Box */}
        {isEditing ? (
          <textarea
            ref={textAreaRef}
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionSave}
            className="w-full p-2 border rounded"
            rows={4}
          />
        ) : (
          <div
            onClick={enableEditing}
            className="p-2 text-gray-600 cursor-pointer text-xs whitespace-pre-wrap" // Add this class to preserve newlines
          >
            {description || 'Click here to add a description...'}
          </div>
        )}
      </div>
    </li>
  );
  
}
