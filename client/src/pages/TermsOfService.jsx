import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import AppTheme from "../AppTheme";

const TermsOfService = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppTheme>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            หน้าหลัก
          </MuiLink>
          <Typography color="text.primary">
            ข้อตกลงและเงื่อนไขการใช้บริการ
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            ข้อตกลงและเงื่อนไขการใช้บริการแพลตฟอร์ม Find Mate
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            วันที่มีผลบังคับใช้: 10 มีนาคม 2567
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            บทนำ
          </Typography>
          <Typography paragraph>
            ข้อตกลงและเงื่อนไขการใช้บริการฉบับนี้ ("ข้อตกลง")
            กำหนดเงื่อนไขที่ผูกพันทางกฎหมายระหว่างบริษัท Find Mate ("บริษัท"
            หรือ "ผู้ให้บริการ") และบุคคลที่เข้าถึงหรือใช้งานแพลตฟอร์ม Find Mate
            ("ผู้ใช้บริการ" หรือ "ท่าน")
            ข้อตกลงนี้ควบคุมการเข้าถึงและการใช้งานแพลตฟอร์ม Find Mate
            รวมถึงเว็บไซต์ แอปพลิเคชัน และบริการทั้งหมดที่เกี่ยวข้อง
            (รวมเรียกว่า "แพลตฟอร์ม")
            ซึ่งเป็นแพลตฟอร์มที่ออกแบบมาเพื่อช่วยในการค้นหาและจับคู่รูมเมทสำหรับนักศึกษา
          </Typography>
          <Typography paragraph>
            โปรดอ่านข้อตกลงนี้โดยละเอียดก่อนการเข้าถึงหรือใช้งานแพลตฟอร์ม
            การเข้าถึงหรือใช้งานแพลตฟอร์มไม่ว่าในลักษณะใดถือเป็นการยอมรับและตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุในข้อตกลงนี้
            หากท่านไม่เห็นด้วยกับข้อกำหนดและเงื่อนไขใดๆ ของข้อตกลงนี้
            ท่านไม่มีสิทธิ์ในการเข้าถึงหรือใช้งานแพลตฟอร์ม
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            1. นิยามและคำจำกัดความ
          </Typography>

          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              1.1 "ผู้ใช้บริการ" หมายถึง
              บุคคลธรรมดาที่ได้ลงทะเบียนและสร้างบัญชีผู้ใช้บนแพลตฟอร์ม Find Mate
            </Typography>
            <Typography paragraph>
              1.2 "บัญชีผู้ใช้" หมายถึง
              บัญชีส่วนบุคคลที่ผู้ใช้บริการสร้างขึ้นบนแพลตฟอร์ม Find Mate
              โดยให้ข้อมูลที่จำเป็นและได้รับการยืนยันตัวตนผ่านกระบวนการที่กำหนด
            </Typography>
            <Typography paragraph>
              1.3 "เนื้อหาผู้ใช้" หมายถึง ข้อมูล ข้อความ รูปภาพ หรือสื่อใดๆ
              ที่ผู้ใช้บริการอัปโหลด โพสต์ ส่ง หรือจัดเตรียมผ่านแพลตฟอร์ม
              รวมถึงแต่ไม่จำกัดเพียงข้อมูลส่วนบุคคล ลักษณะนิสัย
              และข้อมูลการติดต่อ
            </Typography>
            <Typography paragraph>
              1.4 "ข้อมูลส่วนบุคคล" หมายถึง
              ข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวบุคคลนั้นได้ไม่ว่าทางตรงหรือทางอ้อม
              ตามที่นิยามไว้ในพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            </Typography>
            <Typography paragraph>
              1.5 "การจับคู่" หมายถึง
              เหตุการณ์ที่เกิดขึ้นเมื่อผู้ใช้บริการสองรายแสดงความสนใจซึ่งกันและกันผ่านฟังก์ชันการถูกใจบนแพลตฟอร์ม
            </Typography>
            <Typography paragraph>
              1.6 "ข้อมูลการติดต่อ" หมายถึง ข้อมูลที่ใช้ในการติดต่อผู้ใช้บริการ
              ซึ่งรวมถึงแต่ไม่จำกัดเพียงชื่อบัญชีโซเชียลมีเดีย ไอดีไลน์
              และหมายเลขโทรศัพท์
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            2. การลงทะเบียนและบัญชีผู้ใช้
          </Typography>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            2.1 คุณสมบัติของผู้ใช้บริการ
          </Typography>
          <Typography paragraph>
            ในการลงทะเบียนและใช้งานแพลตฟอร์ม ผู้ใช้บริการต้อง:
          </Typography>
          <Box sx={{ ml: 4 }}>
            <Typography paragraph>
              (ก) มีอายุไม่ต่ำกว่า 15 ปีบริบูรณ์
              <br />
              (ข) มีความสามารถทางกฎหมายในการเข้าทำสัญญาที่มีผลผูกพัน
              <br />
              (ค) ไม่เคยถูกระงับหรือเพิกถอนสิทธิ์การใช้งานแพลตฟอร์มก่อนหน้านี้
              <br />
              (ง) ปฏิบัติตามข้อกำหนดและเงื่อนไขทั้งหมดในข้อตกลงนี้
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            2.2 กระบวนการลงทะเบียน
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              2.2.1
              ผู้ใช้บริการต้องลงทะเบียนเพื่อสร้างบัญชีผู้ใช้โดยให้ข้อมูลต่อไปนี้:
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography paragraph>
                (ก) ชื่อผู้ใช้
                <br />
                (ข) ที่อยู่อีเมลที่ถูกต้องและใช้งานได้
                <br />
                (ค) รหัสผ่าน
                <br />
                (ง) ข้อมูลอื่นๆ ที่ระบุว่าจำเป็นในกระบวนการลงทะเบียน
              </Typography>
            </Box>

            <Typography paragraph>
              2.2.2 ผู้ใช้บริการต้องยืนยันตัวตนผ่านรหัส OTP (One-Time Password)
              ที่จะถูกส่งไปยังที่อยู่อีเมลที่ได้ลงทะเบียนไว้ รหัส OTP
              มีอายุการใช้งาน 5 นาที และสามารถใช้ได้ไม่เกิน 3 ครั้ง
              หากไม่สามารถยืนยันตัวตนได้ภายในข้อจำกัดดังกล่าว
              ท่านจะต้องเริ่มกระบวนการลงทะเบียนใหม่
            </Typography>

            <Typography paragraph>
              2.2.3 หลังจากการยืนยันตัวตนสำเร็จ
              ผู้ใช้บริการจะต้องกรอกข้อมูลส่วนบุคคลและลักษณะนิสัยให้ครบถ้วนก่อนจึงจะสามารถใช้งานแพลตฟอร์มได้อย่างเต็มรูปแบบ
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            2.3 ความถูกต้องของข้อมูล
          </Typography>
          <Typography paragraph>
            ผู้ใช้บริการรับรองและรับประกันว่าข้อมูลทั้งหมดที่ให้ไว้ในกระบวนการลงทะเบียนและการใช้งานแพลตฟอร์มเป็นความจริง
            ถูกต้อง ครบถ้วน และเป็นปัจจุบัน
            ผู้ใช้บริการตกลงที่จะปรับปรุงข้อมูลให้เป็นปัจจุบันทันทีที่มีการเปลี่ยนแปลง
            การให้ข้อมูลที่เป็นเท็จ ไม่ถูกต้อง
            หรือไม่สมบูรณ์อาจส่งผลให้ถูกระงับหรือยกเลิกบัญชีผู้ใช้โดยทันที
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            2.4 ความปลอดภัยของบัญชีผู้ใช้
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              2.4.1
              ผู้ใช้บริการมีหน้าที่รับผิดชอบในการเก็บรักษาความลับของข้อมูลการเข้าสู่ระบบ
              รวมถึงแต่ไม่จำกัดเพียงรหัสผ่าน
              และมีหน้าที่จำกัดการเข้าถึงอุปกรณ์ที่ใช้ในการเข้าถึงแพลตฟอร์ม
            </Typography>
            <Typography paragraph>
              2.4.2
              ผู้ใช้บริการตกลงที่จะแจ้งให้บริษัททราบทันทีหากพบหรือสงสัยว่ามีการใช้งานบัญชีโดยไม่ได้รับอนุญาต
              หรือมีการละเมิดความปลอดภัยอื่นใด
            </Typography>
            <Typography paragraph>
              2.4.3
              ผู้ใช้บริการจะต้องรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของตน
              ไม่ว่าจะได้อนุญาตหรือไม่ก็ตาม
              บริษัทจะไม่รับผิดชอบต่อความสูญเสียหรือความเสียหายใดๆ
              อันเกิดจากการที่ผู้ใช้บริการไม่ปฏิบัติตามข้อกำหนดในส่วนนี้
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            2.5 การห้ามถ่ายโอนบัญชี
          </Typography>
          <Typography paragraph>
            บัญชีผู้ใช้เป็นสิทธิเฉพาะบุคคลและไม่สามารถโอนให้บุคคลอื่นได้
            ผู้ใช้บริการห้ามอนุญาตให้บุคคลอื่นใช้บัญชีของตน
            และห้ามโอนหรือจำหน่ายบัญชีไม่ว่าในลักษณะใด
            การละเมิดข้อกำหนดนี้อาจส่งผลให้ถูกระงับหรือยกเลิกบัญชีผู้ใช้โดยทันที
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            3. การเก็บรวบรวมและการใช้ข้อมูล
          </Typography>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            3.1 ข้อมูลที่จำเป็น
          </Typography>
          <Typography paragraph>
            เพื่อให้บริการอย่างมีประสิทธิภาพ
            บริษัทจำเป็นต้องเก็บรวบรวมและประมวลผลข้อมูลต่อไปนี้จากผู้ใช้บริการ:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              3.1.1 ข้อมูลบัญชีผู้ใช้: ชื่อผู้ใช้ ที่อยู่อีเมล รหัสผ่าน
              (ในรูปแบบเข้ารหัส)
            </Typography>
            <Typography paragraph>
              3.1.2 ข้อมูลส่วนบุคคล: ชื่อ-นามสกุล ชื่อเล่น อายุ เพศ
              สถานภาพการสมรส ความหลากหลายทางเพศ จังหวัด มหาวิทยาลัย
            </Typography>
            <Typography paragraph>
              3.1.3 ลักษณะนิสัย: บุคลิกภาพ เวลานอน เวลาตื่น นิสัยด้านความสะอาด
              การใช้เครื่องปรับอากาศ การดื่มแอลกอฮอล์ การสูบบุหรี่
              นิสัยการชำระค่าใช้จ่าย การแบ่งค่าใช้จ่าย การเลี้ยงสัตว์ การทำอาหาร
              ระดับเสียง การพาเพื่อนมาที่พัก ทัศนคติเกี่ยวกับความเชื่อทางศาสนา
              และรูปแบบการอยู่ร่วมกัน
            </Typography>
            <Typography paragraph>
              3.1.4 ข้อมูลที่พัก: ชื่อหอพัก ค่าหอพักต่อเดือน ยานพาหนะ
            </Typography>
            <Typography paragraph>
              3.1.5 ข้อมูลการติดต่อ: ชื่อบัญชี Facebook ชื่อบัญชี Instagram
              ไอดีไลน์ หมายเลขโทรศัพท์
            </Typography>
            <Typography paragraph>3.1.6 รูปภาพโปรไฟล์</Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            3.2 วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล
          </Typography>
          <Typography paragraph>
            บริษัทจะเก็บรวบรวมและใช้ข้อมูลของผู้ใช้บริการเพื่อวัตถุประสงค์ดังต่อไปนี้:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              3.2.1 เพื่อให้บริการและบำรุงรักษาแพลตฟอร์ม
            </Typography>
            <Typography paragraph>
              3.2.2 เพื่อสร้างและจัดการบัญชีผู้ใช้
            </Typography>
            <Typography paragraph>
              3.2.3
              เพื่อยืนยันตัวตนและป้องกันการฉ้อโกงหรือการใช้งานที่ไม่ได้รับอนุญาต
            </Typography>
            <Typography paragraph>
              3.2.4 เพื่อคำนวณความเข้ากันได้ระหว่างผู้ใช้บริการโดยใช้อัลกอริทึม
              K-Nearest Neighbors (KNN)
            </Typography>
            <Typography paragraph>
              3.2.5
              เพื่อแสดงข้อมูลของผู้ใช้บริการต่อผู้ใช้บริการรายอื่นตามความเหมาะสม
            </Typography>
            <Typography paragraph>
              3.2.6
              เพื่ออำนวยความสะดวกในการจับคู่และการติดต่อระหว่างผู้ใช้บริการที่มีความสนใจร่วมกัน
            </Typography>
            <Typography paragraph>
              3.2.7 เพื่อส่งการแจ้งเตือนเกี่ยวกับการจับคู่ การอัปเดตบริการ
              และข้อมูลสำคัญอื่นๆ
            </Typography>
            <Typography paragraph>
              3.2.8 เพื่อตอบสนองต่อข้อสอบถาม การร้องเรียน
              หรือการขอความช่วยเหลือของผู้ใช้บริการ
            </Typography>
            <Typography paragraph>
              3.2.9 เพื่อปรับปรุงและพัฒนาแพลตฟอร์มและบริการให้ดียิ่งขึ้น
            </Typography>
            <Typography paragraph>
              3.2.10 เพื่อตรวจสอบและป้องกันกิจกรรมที่ไม่ได้รับอนุญาต ผิดกฎหมาย
              หรือละเมิดข้อตกลงนี้
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            3.3 การเปิดเผยข้อมูล
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              3.3.1
              บริษัทจะเปิดเผยข้อมูลส่วนบุคคลและลักษณะนิสัยของผู้ใช้บริการต่อผู้ใช้บริการรายอื่นบนแพลตฟอร์มตามหลักการทำงานของบริการ
            </Typography>
            <Typography paragraph>
              3.3.2 ข้อมูลการติดต่อจะเปิดเผยเฉพาะในกรณีที่เกิดการจับคู่เท่านั้น
              (ทั้งสองฝ่ายกดถูกใจซึ่งกันและกัน)
            </Typography>
            <Typography paragraph>
              3.3.3
              บริษัทอาจเปิดเผยข้อมูลของผู้ใช้บริการแก่บุคคลที่สามในกรณีดังต่อไปนี้:
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography paragraph>
                (ก) ตามที่กฎหมายกำหนด หรือตามคำสั่งศาล
                หรือหน่วยงานที่มีอำนาจตามกฎหมาย
                <br />
                (ข) เพื่อปกป้องสิทธิ ทรัพย์สิน หรือความปลอดภัยของบริษัท
                ผู้ใช้บริการ หรือบุคคลอื่น
                <br />
                (ค) เพื่อตรวจสอบ ป้องกัน
                หรือดำเนินการเกี่ยวกับกิจกรรมที่ผิดกฎหมาย การหลอกลวง
                หรือปัญหาความปลอดภัย
                <br />
                (ง)
                เพื่อวัตถุประสงค์ในการบริหารจัดการแพลตฟอร์มหรือการให้บริการสนับสนุน
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            3.4 การประมวลผลและการจัดเก็บข้อมูล
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              3.4.1
              บริษัทจะประมวลผลและจัดเก็บข้อมูลของผู้ใช้บริการตามมาตรฐานอุตสาหกรรมที่เหมาะสมและเป็นไปตามกฎหมายคุ้มครองข้อมูลส่วนบุคคลที่เกี่ยวข้อง
            </Typography>
            <Typography paragraph>
              3.4.2
              บริษัทจะเก็บรักษาข้อมูลของผู้ใช้บริการตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้ในข้อตกลงนี้
              หรือตามที่กฎหมายกำหนด
            </Typography>
            <Typography paragraph>
              3.4.3 เมื่อผู้ใช้บริการลบบัญชี
              ข้อมูลส่วนบุคคลและเนื้อหาผู้ใช้จะถูกลบออกจากระบบภายในระยะเวลาที่เหมาะสม
              เว้นแต่เป็นกรณีที่บริษัทมีหน้าที่ตามกฎหมายในการเก็บรักษาข้อมูลดังกล่าว
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            3.5 สิทธิของผู้ใช้บริการเกี่ยวกับข้อมูลส่วนบุคคล
          </Typography>
          <Typography paragraph>
            ผู้ใช้บริการมีสิทธิดังต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของตน:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              3.5.1 สิทธิในการเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล
            </Typography>
            <Typography paragraph>
              3.5.2 สิทธิในการแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง
            </Typography>
            <Typography paragraph>
              3.5.3 สิทธิในการลบหรือทำลายข้อมูลส่วนบุคคล
              ภายใต้เงื่อนไขที่กฎหมายกำหนด
            </Typography>
            <Typography paragraph>
              3.5.4 สิทธิในการคัดค้านการเก็บรวบรวม ใช้
              หรือเปิดเผยข้อมูลส่วนบุคคล ภายใต้เงื่อนไขที่กฎหมายกำหนด
            </Typography>
            <Typography paragraph>
              3.5.5 สิทธิในการจำกัดการใช้ข้อมูลส่วนบุคคล
              ภายใต้เงื่อนไขที่กฎหมายกำหนด
            </Typography>
            <Typography paragraph>3.5.6 สิทธิในการเพิกถอนความยินยอม</Typography>
            <Typography paragraph>
              3.5.7 สิทธิในการร้องเรียนต่อหน่วยงานกำกับดูแลที่เกี่ยวข้อง
            </Typography>
          </Box>
          <Typography paragraph>
            ผู้ใช้บริการสามารถใช้สิทธิดังกล่าวโดยติดต่อบริษัทตามช่องทางที่ระบุไว้ในข้อ
            14 "การติดต่อ"
          </Typography>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            3.4 การประมวลผลและการจัดเก็บข้อมูล
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              3.4.1
              บริษัทจะประมวลผลและจัดเก็บข้อมูลของผู้ใช้บริการตามมาตรฐานอุตสาหกรรมที่เหมาะสมและเป็นไปตามกฎหมายคุ้มครองข้อมูลส่วนบุคคลที่เกี่ยวข้อง
            </Typography>
            <Typography paragraph>
              3.4.2
              บริษัทจะเก็บรักษาข้อมูลของผู้ใช้บริการตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้ในข้อตกลงนี้
              หรือตามที่กฎหมายกำหนด
            </Typography>
            <Typography paragraph>
              3.4.3 เมื่อผู้ใช้บริการลบบัญชี
              ข้อมูลส่วนบุคคลและเนื้อหาผู้ใช้จะถูกลบออกจากระบบภายในระยะเวลาที่เหมาะสม
              เว้นแต่เป็นกรณีที่บริษัทมีหน้าที่ตามกฎหมายในการเก็บรักษาข้อมูลดังกล่าว
            </Typography>
          </Box>

          {/* Sections 4-14 would continue here */}
          {/* For brevity in this example, I'll add just section headings */}

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            4. การใช้แพลตฟอร์ม
          </Typography>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            4.1 ข้อกำหนดในการใช้งาน
          </Typography>
          <Typography paragraph>
            เพื่อให้บริการอย่างมีประสิทธิภาพ
            บริษัทจำเป็นต้องเก็บรวบรวมและประมวลผลข้อมูลต่อไปนี้จากผู้ใช้บริการ:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              4.1.1
              ผู้ใช้บริการตกลงที่จะใช้แพลตฟอร์มเฉพาะเพื่อวัตถุประสงค์ที่ชอบด้วยกฎหมายและสอดคล้องกับข้อตกลงนี้
            </Typography>
            <Typography paragraph>
              4.1.2
              ผู้ใช้บริการต้องกรอกข้อมูลส่วนบุคคลและลักษณะนิสัยให้ครบถ้วนก่อนจึงจะสามารถเข้าถึงคุณสมบัติการค้นหาและจับคู่รูมเมทได้
            </Typography>
            <Typography paragraph>
              4.1.3 ผู้ใช้บริการต้องให้ข้อมูลการติดต่ออย่างน้อยหนึ่งช่องทาง
              ซึ่งจะถูกเปิดเผยเฉพาะเมื่อเกิดการจับคู่เท่านั้น
            </Typography>
            <Typography paragraph>
              4.1.4
              ผู้ใช้บริการสามารถแสดงความสนใจผู้ใช้บริการรายอื่นผ่านฟังก์ชันการถูกใจ
              การจับคู่จะเกิดขึ้นเมื่อผู้ใช้บริการทั้งสองฝ่ายกดถูกใจซึ่งกันและกัน
            </Typography>
            <Typography paragraph>
              4.1.5 เมื่อเกิดการจับคู่
              ผู้ใช้บริการทั้งสองฝ่ายจะได้รับการแจ้งเตือนทางอีเมล
              และสามารถเข้าถึงข้อมูลการติดต่อของอีกฝ่ายได้
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            4.2 ข้อจำกัดในการใช้งาน
          </Typography>
          <Typography paragraph>ผู้ใช้บริการตกลงที่จะไม่:</Typography>
          <Typography paragraph>
            เพื่อให้บริการอย่างมีประสิทธิภาพ
            บริษัทจำเป็นต้องเก็บรวบรวมและประมวลผลข้อมูลต่อไปนี้จากผู้ใช้บริการ:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              4.2.1 ใช้แพลตฟอร์มเพื่อวัตถุประสงค์ที่ผิดกฎหมาย ไม่เหมาะสม
              หรือละเมิดข้อตกลงนี้
            </Typography>
            <Typography paragraph>
              4.2.2 สร้างบัญชีปลอม ให้ข้อมูลเท็จ หรือปลอมแปลงตัวตน
            </Typography>
            <Typography paragraph>
              4.2.3 ล่วงละเมิด คุกคาม ข่มขู่ หรือรบกวนผู้ใช้บริการรายอื่น
            </Typography>
            <Typography paragraph>
              4.2.4 รวบรวม เก็บ
              หรือเผยแพร่ข้อมูลส่วนบุคคลของผู้ใช้บริการรายอื่นโดยไม่ได้รับอนุญาต
            </Typography>
            <Typography paragraph>
              4.2.5 เผยแพร่เนื้อหาที่ผิดกฎหมาย ลามกอนาจาร รุนแรง เป็นเท็จ
              หลอกลวง หรือละเมิดสิทธิของบุคคลอื่น
            </Typography>
            <Typography paragraph>
              4.2.6 ใช้โปรแกรมอัตโนมัติ สคริปต์ บอท
              หรือวิธีการอื่นใดเพื่อเข้าถึงแพลตฟอร์มโดยไม่ได้รับอนุญาต
            </Typography>
            <Typography paragraph>
              4.2.7 แทรกแซง รบกวน เปลี่ยนแปลง หรือทำลายการทำงานปกติของแพลตฟอร์ม
            </Typography>
            <Typography paragraph>
              4.2.8 ละเมิดทรัพย์สินทางปัญญาของบริษัทหรือบุคคลที่สาม
            </Typography>
            <Typography paragraph>
              4.2.9
              ใช้แพลตฟอร์มในเชิงพาณิชย์หรือเพื่อวัตถุประสงค์อื่นนอกเหนือจากการค้นหารูมเมท
            </Typography>
            <Typography paragraph>
              4.2.10
              ใช้บริการในลักษณะที่ก่อให้เกิดความเสียหายหรือเสื่อมเสียต่อบริษัทหรือบุคคลอื่น
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            5. การรายงานและการระงับบัญชี
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            6. การลบบัญชีและข้อมูล
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            7. ทรัพย์สินทางปัญญา
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            8. ข้อสงวนสิทธิ์และข้อจำกัดความรับผิด
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            9. การเปลี่ยนแปลงบริการและข้อตกลง
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            10. การแก้ไขข้อพิพาท
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            11. เบ็ดเตล็ด
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            11.1 การสื่อสาร
          </Typography>
          <Typography paragraph>
            โดยการลงทะเบียนและใช้งานแพลตฟอร์ม
            ผู้ใช้บริการยินยอมที่จะรับการสื่อสารทางอิเล็กทรอนิกส์จากบริษัท
            ซึ่งรวมถึงแต่ไม่จำกัดเพียงอีเมลและการแจ้งเตือนบนแพลตฟอร์ม
            บริษัทอาจสื่อสารกับผู้ใช้บริการเกี่ยวกับบัญชีผู้ใช้ การจับคู่
            การปรับปรุงแพลตฟอร์ม หรือเรื่องอื่นๆ ที่เกี่ยวข้องกับการใช้แพลตฟอร์ม
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            11.2 ความสมบูรณ์ของข้อตกลง
          </Typography>
          <Typography paragraph>
            ข้อตกลงนี้ประกอบด้วยความเข้าใจทั้งหมดระหว่างผู้ใช้บริการและบริษัทเกี่ยวกับเรื่องที่ระบุไว้ในที่นี้
            และแทนที่ข้อตกลง การสื่อสาร และการเสนอก่อนหน้านี้ทั้งหมด
            ไม่ว่าจะเป็นลายลักษณ์อักษรหรือทางวาจา เกี่ยวกับเรื่องดังกล่าว
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            11.3 การสละสิทธิ์
          </Typography>
          <Typography paragraph>
            การที่บริษัทไม่ใช้สิทธิ์หรือบทบัญญัติใดๆ
            ของข้อตกลงนี้ไม่ถือเป็นการสละสิทธิ์ในเรื่องดังกล่าวหรือสิทธิ์หรือบทบัญญัติอื่นใด
            การสละสิทธิ์ใดๆ
            ของบริษัทจะมีผลบังคับใช้ก็ต่อเมื่อได้ทำเป็นลายลักษณ์อักษรและลงนามโดยผู้มีอำนาจของบริษัท
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            11.4 ความสามารถในการแยกส่วน
          </Typography>
          <Typography paragraph>
            หากบทบัญญัติใดของข้อตกลงนี้ถูกพบว่าไม่มีผลบังคับใช้หรือไม่ถูกต้องตามกฎหมาย
            บทบัญญัตินั้นจะถูกแก้ไขให้สอดคล้องกับเจตนารมณ์ของคู่สัญญาทั้งสองฝ่ายมากที่สุดเท่าที่กฎหมายจะอนุญาต
            และส่วนที่เหลือของข้อตกลงยังคงมีผลบังคับใช้เต็มที่
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            11.5 การโอนสิทธิ์
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              11.5.1 ผู้ใช้บริการไม่สามารถโอนสิทธิ์หรือภาระผูกพันใดๆ
              ภายใต้ข้อตกลงนี้โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรจากบริษัท
            </Typography>
            <Typography paragraph>
              11.5.2 บริษัทอาจโอนสิทธิ์หรือภาระผูกพันใดๆ
              ภายใต้ข้อตกลงนี้ได้โดยไม่ต้องได้รับความยินยอมจากผู้ใช้บริการ
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            11.6 การรอดพ้น
          </Typography>
          <Typography paragraph>
            บทบัญญัติของข้อตกลงนี้ซึ่งโดยลักษณะแล้วควรมีผลบังคับใช้ต่อไปหลังการสิ้นสุดของข้อตกลง
            จะยังคงมีผลบังคับใช้หลังจากการสิ้นสุดดังกล่าว
            รวมถึงแต่ไม่จำกัดเพียงบทบัญญัติเกี่ยวกับทรัพย์สินทางปัญญา
            ข้อสงวนสิทธิ์และข้อจำกัดความรับผิด การชดใช้ค่าเสียหาย
            และการแก้ไขข้อพิพาท
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            12. การใช้ข้อมูลส่วนบุคคลตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            12.1 ฐานทางกฎหมายในการประมวลผลข้อมูลส่วนบุคคล
          </Typography>
          <Typography paragraph>
            บริษัทประมวลผลข้อมูลส่วนบุคคลของผู้ใช้บริการตามหลักเกณฑ์ที่กำหนดไว้ในพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
            พ.ศ. 2562 โดยอาศัยฐานทางกฎหมาย ดังต่อไปนี้:
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              12.1.1 ความยินยอม: สำหรับการประมวลผลข้อมูลส่วนบุคคลบางประเภท เช่น
              ข้อมูลเกี่ยวกับความหลากหลายทางเพศ
              หรือการใช้รูปภาพโปรไฟล์เพื่อวัตถุประสงค์ในการแสดงต่อผู้ใช้บริการรายอื่น
            </Typography>
            <Typography paragraph>
              12.1.2 การปฏิบัติตามสัญญา:
              สำหรับการประมวลผลข้อมูลที่จำเป็นต่อการปฏิบัติตามข้อตกลงระหว่างบริษัทและผู้ใช้บริการ
              เช่น การสร้างและจัดการบัญชีผู้ใช้ การคำนวณความเข้ากันได้
              และการอำนวยความสะดวกในการจับคู่
            </Typography>
            <Typography paragraph>
              12.1.3 ประโยชน์โดยชอบด้วยกฎหมาย:
              สำหรับการประมวลผลข้อมูลที่จำเป็นเพื่อประโยชน์โดยชอบด้วยกฎหมายของบริษัท
              เช่น การปรับปรุงแพลตฟอร์ม การป้องกันการฉ้อโกง
              และการบังคับใช้ข้อตกลงของบริษัท
            </Typography>
            <Typography paragraph>
              12.1.4 การปฏิบัติตามกฎหมาย:
              สำหรับการประมวลผลข้อมูลที่จำเป็นเพื่อปฏิบัติตามภาระผูกพันทางกฎหมายที่บริษัทต้องปฏิบัติตาม
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            12.2 ระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              12.2.1
              บริษัทจะเก็บรักษาข้อมูลส่วนบุคคลของผู้ใช้บริการตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้ในข้อตกลงนี้
              หรือตามที่กฎหมายกำหนด
            </Typography>
            <Typography paragraph>
              12.2.2 ในกรณีที่ผู้ใช้บริการลบบัญชีผู้ใช้
              บริษัทจะลบหรือทำให้ข้อมูลส่วนบุคคลของผู้ใช้บริการไม่สามารถระบุตัวบุคคลได้ภายใน
              30 วัน เว้นแต่:
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography paragraph>
                (ก)
                มีกฎหมายกำหนดให้บริษัทต้องเก็บรักษาข้อมูลไว้เป็นระยะเวลานานกว่านั้น
                <br />
                (ข)
                บริษัทมีความจำเป็นต้องเก็บรักษาข้อมูลไว้เพื่อการก่อตั้งสิทธิเรียกร้องตามกฎหมาย
                การปฏิบัติตามหรือการใช้สิทธิเรียกร้องตามกฎหมาย
                หรือการยกขึ้นต่อสู้สิทธิเรียกร้องตามกฎหมาย
                <br />
                (ค)
                บริษัทมีฐานทางกฎหมายอื่นในการเก็บรักษาข้อมูลส่วนบุคคลนั้นต่อไป
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            12.3 การโอนข้อมูลส่วนบุคคลไปยังต่างประเทศ
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              12.3.1
              บริษัทอาจโอนข้อมูลส่วนบุคคลของผู้ใช้บริการไปยังต่างประเทศเพื่อวัตถุประสงค์ในการให้บริการแพลตฟอร์ม
              เช่น การจัดเก็บข้อมูลบนระบบคลาวด์ที่ตั้งอยู่ในต่างประเทศ
            </Typography>
            <Typography paragraph>
              12.3.2
              ในกรณีที่ประเทศปลายทางไม่มีมาตรฐานการคุ้มครองข้อมูลส่วนบุคคลที่เพียงพอตามที่กฎหมายกำหนด
              บริษัทจะดำเนินการให้มีมาตรการคุ้มครองข้อมูลส่วนบุคคลที่เหมาะสมเพื่อให้การโอนข้อมูลส่วนบุคคลมีความปลอดภัยและเป็นไปตามที่กฎหมายกำหนด
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            13. ข้อกำหนดเฉพาะสำหรับการคุ้มครองความปลอดภัยของผู้ใช้บริการ
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            13.1 การยืนยันตัวตนและความปลอดภัยของบัญชี
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              13.1.1
              เพื่อเป็นการยืนยันตัวตนและเพิ่มความปลอดภัยให้แก่ผู้ใช้บริการ
              บริษัทอาจดำเนินการดังต่อไปนี้:
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography paragraph>
                (ก) ใช้ระบบการยืนยันตัวตนด้วยรหัส OTP ทางอีเมล
                <br />
                (ข) กำหนดให้ผู้ใช้บริการสร้างรหัสผ่านที่มีความซับซ้อนเพียงพอ
                <br />
                (ค)
                ตรวจสอบกิจกรรมที่น่าสงสัยและอาจระงับบัญชีชั่วคราวหากพบความเสี่ยงด้านความปลอดภัย
              </Typography>
            </Box>
            <Typography paragraph>
              13.1.2
              ผู้ใช้บริการควรดำเนินการดังต่อไปนี้เพื่อรักษาความปลอดภัยของบัญชี:
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography paragraph>
                (ก) ใช้รหัสผ่านที่เป็นเอกลักษณ์และไม่ซ้ำกับบริการอื่น
                <br />
                (ข) ไม่เปิดเผยข้อมูลการเข้าสู่ระบบให้กับบุคคลอื่น
                <br />
                (ค) ออกจากระบบทุกครั้งเมื่อใช้อุปกรณ์สาธารณะ
                <br />
                (ง) แจ้งให้บริษัททราบทันทีหากพบกิจกรรมที่น่าสงสัยในบัญชี
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            13.2 ความปลอดภัยในการพบปะกับผู้ใช้บริการรายอื่น
          </Typography>
          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              13.2.1
              บริษัทแนะนำให้ผู้ใช้บริการปฏิบัติตามแนวทางต่อไปนี้เมื่อตัดสินใจพบปะกับผู้ใช้บริการรายอื่นที่พบผ่านแพลตฟอร์ม:
            </Typography>
            <Box sx={{ ml: 4 }}>
              <Typography paragraph>
                (ก)
                เริ่มจากการสื่อสารผ่านช่องทางออนไลน์เพื่อทำความรู้จักกันให้มากขึ้นก่อนการพบปะในชีวิตจริง
                <br />
                (ข) นัดพบในสถานที่สาธารณะที่มีผู้คนพลุกพล่าน เช่น ร้านกาแฟ
                หรือห้างสรรพสินค้า ในช่วงเวลากลางวัน
                <br />
                (ค) แจ้งให้เพื่อนหรือครอบครัวทราบเกี่ยวกับการนัดพบ
                รวมถึงสถานที่และเวลา
                <br />
                (ง) หลีกเลี่ยงการเปิดเผยข้อมูลส่วนตัวมากเกินไปในการพบกันครั้งแรก
                <br />
                (จ) เชื่อใจสัญชาตญาณของตนเอง หากรู้สึกไม่สบายใจหรือไม่ปลอดภัย
                ให้ยุติการพบปะและออกจากสถานการณ์นั้นทันที
              </Typography>
            </Box>
            <Typography paragraph>
              13.2.2 บริษัทไม่รับผิดชอบต่อเหตุการณ์หรือความเสียหายใดๆ
              ที่เกิดขึ้นจากการพบปะระหว่างผู้ใช้บริการ
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", mt: 4 }}
          >
            14. การติดต่อ
          </Typography>
          <Typography paragraph>
            หากท่านมีคำถาม ข้อสงสัย
            หรือข้อเสนอแนะเกี่ยวกับข้อตกลงนี้หรือแพลตฟอร์ม
            หรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคลของท่าน
            โปรดติดต่อบริษัทตามช่องทางดังต่อไปนี้:
          </Typography>
          <Typography paragraph sx={{ ml: 2 }}>
            อีเมล: findmate.official@gmail.com
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography paragraph sx={{ fontWeight: "bold" }}>
            ข้อตกลงและเงื่อนไขการใช้บริการฉบับนี้มีผลบังคับใช้ตั้งแต่วันที่ 10
            มีนาคม 2567
          </Typography>
          <Typography paragraph>
            โดยการเข้าถึงหรือใช้งานแพลตฟอร์ม Find Mate
            ท่านยืนยันว่าท่านได้อ่านและเข้าใจข้อตกลงนี้
            และตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้ในที่นี้
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ mx: 1 }}
            >
              กลับ
            </Button>
            <Button
              variant="outlined"
              component="a"
              href="mailto:findmate.official@gmail.com"
              sx={{ mx: 1 }}
            >
              ติดต่อเรา
            </Button>
          </Box>
        </Paper>
      </Container>
    </AppTheme>
  );
};

export default TermsOfService;
