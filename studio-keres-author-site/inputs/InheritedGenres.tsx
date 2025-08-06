import { useEffect, useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import { Card, Text, Stack, Label, Flex, Spinner, Badge } from '@sanity/ui'

// Define a type for the genre data we expect
interface Genre {
  _id: string
  title: string
}

// Define the shape of the query result
interface SeriesWithGenres {
  genres?: Genre[]
}

const InheritedGenres = () => {
  // Get the Sanity client for running queries
  const client = useClient({ apiVersion: '2023-05-03' })
  
  // Get the ID of the referenced series from the book form
  const seriesId = useFormValue(['series', '_ref']) as string

  // State for storing the fetched genre documents
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!seriesId) {
      setGenres([]) // Clear genres if no series is selected
      return
    }

    setIsLoading(true)

    // This query finds the series and then expands the genre references to get their full data
    const query = `*[_id == $seriesId][0]{
      'genres': genres[]->{_id, title}
    }`
    const params = { seriesId }

    client.fetch(query, params).then((data: SeriesWithGenres) => {
      setGenres(data?.genres || [])
      setIsLoading(false)
    })
  }, [seriesId, client]) // Rerun this effect if the selected series changes

  if (!seriesId) {
    return null // Don't show anything if no series is linked yet
  }

  return (
    <Stack space={3}>
      <Label>Inherited Series Genres</Label>
      <Card padding={3} radius={2} shadow={1} tone="transparent">
        {isLoading ? (
          <Flex justify="center">
            <Spinner muted />
          </Flex>
        ) : genres.length > 0 ? (
          <Flex gap={2} wrap="wrap">
            {genres.map((genre) => (
              <Badge key={genre._id} tone="primary">
                {genre.title}
              </Badge>
            ))}
          </Flex>
        ) : (
          <Text muted>This series has no genres assigned to it yet.</Text>
        )}
      </Card>
    </Stack>
  )
}

export default InheritedGenres
