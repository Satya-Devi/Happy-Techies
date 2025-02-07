"use client";
import { useState, useEffect } from "react";
import { SFProRounded } from "@/app/layout";
import {
  Button,
  Group,
  Box,
  Modal,
  Text,
  Title,
} from "@mantine/core";

import { useRouter } from "next/navigation";




const PaymentSuccess = () => {
  

  const [isModalOpen, setModalOpen] = useState(true);
 const router = useRouter();


const openJobs=()=>{
    setModalOpen(false);
    router.push("/my-jobs");    
}
  



  return (
    <div>
    
     
      
          

      <Modal
            opened={isModalOpen}
            onClose={() => openJobs()}
            centered
            size="lg"
          >
            <Box ml={10} mr={10} mb={10}>
              <Title
                ta="left"
                order={1}
                className={SFProRounded.className}
                c="blue"
                mb={10}
              >
                 Success!
                {/* {searchParams?.message && searchParams.message == "Success" ? "Success!" : "Fail!"} */}
              </Title>
              <Text className={SFProRounded.className} c="dark" size="md">
                {/* {searchParams?.message && searchParams.message == "Fail"?"Somthing went wrong Please try again!": ModalText?.length?ModalText:"The form has been submitted successfully!"} */}
               
                Your job listing request has been submitted and is pending approval. You will be notified via email when the job goes live.
              </Text>
              <Group justify="flex-end">
                <Button
                  style={buttonStyle}
                  onClick={() => {
                    openJobs();
                  }}
                  mt="md"
                >
                  Ok
                </Button>
              </Group>
            </Box>
          </Modal>
    </div>
  );
};

export default PaymentSuccess;



const buttonStyle = {
  backgroundColor: "#004a93",
  color: "white",
  // padding: "10px",
  borderRadius: "20px",
  height: "40px",
  fontSize: "16px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

