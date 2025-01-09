import { Card , Image, CardSection,Title,Group,Text} from "@mantine/core"
import classes from './BlogCard.module.css'

const BlogCard=({post}:{post:any})=>{
    return(
        <Card
        component="a"
        href={`/perspectives/${post.slug}`}
         padding="lg"
         px={"sm"}
         radius="md"
         key={post.id}
         withBorder
         style={{
           width: "100%",
           height: "213px",
           display: "flex",
           flexDirection: "row",
         }}
         className={classes.container}
       >
         <Group display="flex"  gap={0}>
         <CardSection
           className={classes.image_section}
           style={{ width: "25%", height: "155px", margin: "10px" }}
         >
           <Image
             src={post.content.image.filename}
             height="100%"
             width="100%"
             style={{ objectFit: "cover" }}
             className={classes.image}
             alt={post.content.title}
           />
         </CardSection>

         <div
           style={{
             flex: "1",
             display: "flex",
             flexDirection: "column",
             justifyContent: "space-between",
             padding: "16px",
             marginLeft: "10px",
           }}
           className={classes.title_wrapper}
         >
           <Group justify="space-between">
             <Title
               className={classes.title}
               style={{ marginBottom: "0px", marginTop: "-24px" }}
             >
               {post.content.title}
             </Title>
           </Group>
           <Group  display={{base:'none',md:"flex"}}>
           <Text size="sm" lineClamp={3}>
             {post.content.description}
           </Text>
           <Text
            className={classes.time}
             c="dimmed"
             size="xs"
             tt="uppercase"
             fw={600}
            //  style={{ marginTop: "16px" }}
           >
             {new Date(post.created_at).toLocaleDateString("en-US", {
               weekday: "short",
               year: "numeric",
               month: "short",
               day: "numeric",
             })}
           </Text>
           </Group>
         </div>
         </Group>
         <Group  display={{base:'flex',md:"none"}}>
           <Text size="sm" lineClamp={2}>
             {post.content.description}
           </Text>
           <Text
            className={classes.time}
             c="dimmed"
             size="xs"
             tt="uppercase"
             fw={600}
             style={{ marginTop: "0px" }}
           >
             {new Date(post.created_at).toLocaleDateString("en-US", {
               weekday: "short",
               year: "numeric",
               month: "short",
               day: "numeric",
             })}
           </Text>
           </Group>
       </Card>
    )
}
export default BlogCard;