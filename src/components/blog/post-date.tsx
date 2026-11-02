interface PostDateProps {
  readonly date: string
  readonly label: 'Published' | 'Updated'
}

export function PostDate({ date, label }: PostDateProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return <time dateTime={date}>{label} {formattedDate}</time>
}
