'use client'

import { List } from '@prisma/client'
import { ElementRef, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { trpc } from '@/trpc/client'
import { useSession } from '@clerk/nextjs'
import { checkUserRole } from '@/app/api/utils/userUtils'

type ListTitleFormProps = {
  initialData: List
  boardId: string
  orgId: string
}

export function ListTitleForm({ initialData,boardId,orgId }: ListTitleFormProps) {
  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const [isEditing, setIsEditing] = useState(false)
  const { session } = useSession();
  const userRole = checkUserRole(session,orgId);

  // Fetch data and refetch
  const { data, refetch } = trpc.list.getListById.useQuery(
    { id: initialData.id },
    {
      initialData: {
        ...initialData,
        createdAt: initialData.createdAt.toISOString(),
        updatedAt: initialData.updatedAt.toISOString(),
      },
    }
  )

  const { mutate, isLoading } = trpc.list.updateList.useMutation({
    onSuccess: (data) => {
      toast.success(`List "${data.title}" updated!`)
      document.title = `${data.title} | Colab Nest`
      setIsEditing(false)
      refetch()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  // Form schema
  const formSchema = z.object({
    id: z.string(),
    title: z.string().min(3, { message: 'Title is too short.' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      id: data?.id,
      title: data?.title,
    },
  })

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data?.title !== values.title) {
      mutate({ id: values.id, title: values.title,boardId})
    }
  }

  // Focus input on edit
  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  // Handle form blur
  const onBlur = () => {
    formRef.current?.requestSubmit()
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-x-2"
          ref={formRef}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="h-7 border-none bg-transparent px-2 py-1 text-lg font-bold focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0"
                    ref={inputRef}
                    disabled={isLoading}
                    onBlur={onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }
  
  if (userRole === 'org:admin'){
    return (
      <Button
        className="h-auto w-auto p-1 px-2 text-lg font-bold"
        variant="transparent"
        onClick={enableEditing}
      >
        {form.getValues('title')}
      </Button>
    )
  }
  return <p className="text-lg font-bold">{form.getValues('title')}</p>
}
