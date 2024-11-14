'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlignLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ElementRef, useRef, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/trpc/client'
import { CardWithList } from '@/types'

type DescriptionProps = {
  data: CardWithList
  refetchCard: any
  refetchLists: any
  refetchAuditLogs: any
}

export function BroadcastDescription({
  data,
  refetchCard,
  refetchLists,
  refetchAuditLogs,
}: DescriptionProps) {
  const params = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [link, setLink] = useState('')
  const [linkName, setLinkName] = useState('')
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)

  const formRef = useRef<ElementRef<'form'>>(null)
  const textareaRef = useRef<ElementRef<'textarea'>>(null)

  const formSchema = z.object({
    description: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: data.description ?? '',
    },
  })

  const { mutate, isLoading } = trpc.card.updateBroadcastCard.useMutation({
    onSuccess: ({ card }) => {
      toast.success(`Card "${card.title}" updated`)
      disableEditing()
      refetchCard()
      refetchAuditLogs()
    },
    onError: (err) => {
      toast.error(err.data?.code)
    },
  })

  const enableEditing = useCallback(() => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }, [])

  const disableEditing = () => {
    setIsEditing(false)
    setIsAddingLink(false)
    setLink('')
    setLinkName('')
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { description } = values
    mutate({
      id: data.id,
      listId: params.blistId as string,
      description,
    })
  }

  const handleAddLink = () => {
    if (link && linkName) {
      const currentDescription = form.getValues('description')
      form.setValue('description', currentDescription + ` [${linkName}](${link})`)
      setIsAddingLink(false)
      setLink('')
      setLinkName('')
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  // Handle click events for editing
  const handleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout) // Clear existing timeout
      setClickTimeout(null) // Reset the timeout state
      enableEditing(); // Enable editing on double click
    } else {
      setClickTimeout(setTimeout(() => {
        setClickTimeout(null); // Reset timeout after 300ms
      }, 300)); // Timeout for single click (300ms)
    }
  };

  return (
    <div className="flex w-full items-start gap-x-3 relative"> {/* Make this relative for absolute positioning */}
      <AlignLeft className="mt-0.5 h-5 w-5 text-neutral-700" aria-hidden="true" />
      <div className="w-full">
        <p className="mb-2 font-semibold text-neutral-700">Description</p>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2" ref={formRef}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Add a more detailed description..."
                        className="mt-2 w-full resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                        ref={textareaRef}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Adding link dialog */}
              {isAddingLink && (
                <div className="absolute w-[300px] top-8 left-2 flex flex-col gap-2 items-start bg-white p-4 rounded-md shadow-md z-10">
                  <input
                    type="text"
                    placeholder="Enter link name to be displayed"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    className="border p-2 rounded-md w-full text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Enter link URL"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="border p-2 rounded-md w-full text-xs"
                  />
                  <div className="flex gap-2">
                    <Button type="button" onClick={handleAddLink} size="sm" variant="primary" className="text-xs">
                      Add Link
                    </Button>
                    <Button type="button" onClick={() => setIsAddingLink(false)} size="sm" variant="ghost" className="text-xs">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-x-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={disableEditing}
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsAddingLink(true)}
                  size="sm"
                  variant="secondary"
                >
                  Add Link
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div
            onClick={handleClick} // Use single click handler
            className="min-h-[78px] rounded-md bg-neutral-200 px-3.5 py-3 text-sm font-medium"
            role="button"
          >
            {data.description ? (
              <div dangerouslySetInnerHTML={{ __html: data.description.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>') }} />
            ) : (
              'Add a more detailed description...'
            )}
          </div>
        )}
      </div>
    </div>
  )
}

BroadcastDescription.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  )
}
