import { Box, Paper, Text } from "@mantine/core"
import style from './JobRoleCard.module.css';
import { SFProRounded } from "@/app/layout";

type Props = {
    role: string,
    onClick: () => void,
    rotate?: number,
    active?: boolean,
    circleImg?: string
}

const JobRoleCard = ({ role='Data & AI', onClick , rotate=0 ,circleImg,active=false}:Props) => {
    return(
        <Paper onClick={onClick} style={{rotate:`${rotate*-1}deg`}} className={`${style.container} ${active?style.active:''}`}>
            <Box className={style.circle} bg={`url('${circleImg}')`}></Box>
            <Text className={style.text+ " "+ SFProRounded.className}>{role}</Text>
        </Paper>
    )
}

export default JobRoleCard;