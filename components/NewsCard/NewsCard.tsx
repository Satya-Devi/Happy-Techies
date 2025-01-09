import { Card, Image, Stack, Text } from "@mantine/core";
import classes from "./NewsCard.module.css";
import { SFProRounded } from "@/app/layout";
import moment from "moment";
 
type NewsProps = {
    title: string;
    description: string;
    image: string;
    url: string;
    published_datetime_utc:string;
}
 
const NewsCard = ({ title, description, image, url ,published_datetime_utc }: NewsProps) => {
    
    const handleClick=()=>{
        window.open(url);
    }
    return (
        <Card onClick={handleClick} className={classes.card}>
            <Image src={image} height={180} alt={title} />
            <Stack className={classes.stack}>
                <Text className={classes.date}>{moment(published_datetime_utc).format('ddd DD MMM YYYY')}</Text>
                <Text className={classes.title+" "+SFProRounded.className}>{title}</Text>
                <Text className={classes.description}>
                   {description.substring(0,120).replace('..','')}... Read more
                </Text>
            </Stack>
        </Card>
    )
}
 
export default NewsCard;