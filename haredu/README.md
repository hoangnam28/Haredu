# HaReDu System

## Basic Business:

### Bối cảnh:

Hiện nay việc học online đang bùng nổ, đặc biệt do sự ảnh hưởng của giai đoạn covid, và để người học cảm thấy an tâm khi có thể tiếp tục hành trình học tập mà không cần phải rời khỏi nhà, sự linh hoạt và tiện lợi của môi trường học trực tuyến.

### Vấn đề hiện tại

Các gia sư dạy online giỏi, có tiềm năng không thể tiếp cận được học viên và các học viên cũng chưa thể tiếp cận được giáo viên uy tín

### Giải quyết vấn đề

Chúng tôi xây dụng trang web như là một bên thứ 3 để kết nối gia sư và học viên.

- Đối với gia sư, cần xác nhận thông tin cá nhân, trình độ giảng dạy (video dạy thử về mảng kiến thức chuyên môn), có quyền đăng bài, chỉnh sửa thông tin các nhân cơ bản, tạo nhóm group học, tạo phòng học, nhận tiền công.

- Đối với sinh viên, cần tạo tài khoản, tìm kiếm gia sư, vào group học theo id, vào room học, xem lại các buổi học, report gia sư, đánh giá khóa học, đăng bài tìm kiếm gia sư.

- Đối với hệ thống:
  * quản lí tiền học: tiền học cần được chuyển vào trước bài giảng đầu tiền, sau khi bài giảng cuối cùng kết thúc 90% sẽ được chuyển cho gia sư
  * sẽ có việc scan ngôn từ trong suốt quá trình giảng dạy để đưa ra thẻ phạt, xử lí cho người phát ngôn, mọi hình phạt kèm envidence sẽ được public trong profile của người dùng sẽ không có quyền chỉnh sửa.
  * Mọi đánh giá của học viên đối với khóa học cũng sẽ được lưu vào profile của gia sư và không được chỉnh sửa.
  
- Đối với đội ngũ nhân viên:
  * phải thực hiện quy trình kiểm duyệt xác nhận đối với mỗi người dùng đăng kí tài khoản với role là gia sư bao gồm: dạy tờ tùy thân, CV, ảnh đại diện, video dạy thử về mảng kiến thức chuyên môn đăng kí
  * Khi gia sư đăng kí thêm bất kì môn học thì cần phải có video dạy thử kèm theo
  * Khi phát sinh report, xung đột giữa gia sư và học viên (học viên report không chuẩn, gia sư có thái độ hành vi tiêu cực lên học viên) thì đội ngũ sẽ phải xem lại đoạn chat trong group, video quá trình giảng dạy để đưa ra thẻ phạt cho người dùng

### Thẻ phạt
  - Hậu quả chung: 
    * Được lưu không thể chỉnh sửa trong profile người dùng
    * Khi bị dính hai thẻ vàng liên tiếp trong 7 ngày thì sẽ tự động biến thành một thẻ đỏ

  - Thẻ phạt vàng (ví dụ: khi một bên sơ suất nói ra một từ quá khích và được bên còn lại đồng ý trao thẻ phạt)
    * Hậu quả:
      + Đối với gia sư: sẽ không được bắt đầu thêm bất kì lớp nào và không được đăng bài tuyển sinh trong 3 ngày

  - Thẻ phạt đỏ (1 bên cố tình xúc phạm nhân phẩm, ngôn từ lăng mạ đối với bên còn lại và bên còn lại sẽ report trực tiếp trong buổi học)
    * Hậu quả:
      + Đối với gia sư: sẽ không được bắt đầu thêm bất kì lớp nào và không được đăng bài tuyển sinh trong 14 ngày và sẽ được hiển thị trực tiếp khi học viên tìm kiếm gia sư
      + Đối với học viên: sẽ được lưu trong profile và sẽ được hiển thị trực tiếp ngay cạnh avatar người dùng
  
  - Thẻ đen (tuồn video ra ngoài)
    * Hậu quả:
      + Khóa tài khoản vĩnh viễn
  
  Mỗi thẻ phạt khi click vào đều hiển thị thông tin: ngày xuất hiện, lí do, dẫn chứng

## Basic Design
  - màn hình đăng kí SC_AU_001:
   * Gia sư: -> yêu cầu số điện thoại, email -> yêu cầu xác thực số điện thoại bằng mã OTP -> cung cấp thông tin các nhân, CV, giấy tờ tùy thân, ảnh đại diện -> lựa chọn lĩnh vực đăng kí, upload video dạy thử từ 5-7 phút -> nhập password -> hoàn thành việc đăng kí với tình trạng inactive
   * Học viên: -> yêu cầu số điện thoại, email -> yêu cầu xác thực số điện thoại bằng mã OTP -> chọn lĩnh vực muốn học (optional để có thể gợi ý gia sư, khóa học phù hợp) -> nhập password -> hoàn thành việc đăng kí 
  
  - Màn hình đăng nhập SC_AU_0101:
   * Nhập số điện thoại
   * Nhập password

  - màn profile người dùng
   * Gia sư
    + SC_GS_0001: Khi chưa được active chỉ hiện thị và có thể tự do update, còn khi được active thì khi update thông tin cần đợi kiểm duyệt, cách 1 tháng tính từ thời điểm update gần nhất gia sư mới có thể update lại thông tin profile
    + SC_GS_0002: Nhập, hiển thị thông tin thẻ nhận tiền, rút tiền
    + SC_GS_0003: truy xuất lịch sử thẻ phạt
    + SC_GS_0004: Thay đổi mật khẩu kèm theo OTP
   * Học viên:
    + SC_HV_0001: Tự do update thông tin cá nhân
    + SC_HV_0002: truy xuất lịch sử thẻ phạt

  - màn lớp học của tôi
   * SC_CC_0001 hiển thị danh sách các lớp học hiện tại, lớp học quá khứ
  
  - màn hình giao tiếp SC_MS_0001
    * sẽ có nơi giao tiếp giữa các account (giống messenger) và tính năng tạo lớp học với số buổi học, học phí mỗi thành viên, giới hạn thành viên (tính năng chỉ dành cho gia sư)

  - màn lớp học
    * Giao diện lớp học có thể được thiết kế giống như classroom
    * Thời điểm chốt: tại thời điểm này không thể thêm hoặc bớt member, trước thời điểm nay có thể thêm bớt học viên thoải mái, có thể đóng tiền học, nếu sau thời điểm này số học viên là 0 thì lớp học sẽ tự động close và thông báo về gia sư
    * các học viên cần đóng tiền học sau 3 ngày tính từ thời điểm lớp học được tạo không thì sẽ bị out ra khỏi lớp
    * xuất hiện 1 bar dành cho số lượng buổi học đã đăng kí
    * các bên có thể report nhau tại màn hình này
  - màn buổi học
    * có các video
    * đối với gia sư
     + có thể bổ sung video
     + giao bài tập
    * đối với học viên
     + submit bài tập
     + xem video
  - màn meeting
    * tự động record khi buổi học bắt đầu, sau khi kết thúc sẽ tự động lưu vào màn buổi học

  - màn các bài viết
    * nơi đây sẽ để gia sư, học viên upload các bài tuyển sinh, mỗi người giới hạn 1 bài viết trong 3 ngày (tránh spam bài viết)

ADMIN
 * màn Quản lí các lớp học đã được tạo ra. tìm kiếm theo id, tên lớp học, khi ấn vào 1 record sẽ hiển thị màn hình lớp học chi tiết
 * màn hình lớp học chi tiết: xem được đoạn chat, các video của
 * màn hình quản lí danh sách report
 * xem chi tiết report: reject report, trao thẻ

## Reference:

| Refer       |                 Link                  |
| :-----      | :-----------------------------------: |
| gitlab      | https://gitlab.com/quyquoc2002/haredu |
| Jira        | wdp301g5se1715.atlassian.net          |
| SRS         | https://bit.ly/haredu-srs             |
| SDS         | https://bit.ly/haredu-SDS             |
| Diagram     | https://short.com.vn/LwMN             |
| Nestjs      | https://nestjs.com/                   |
| Tailwindcss | tailwindcss.com                       |
| Ant design  | ng.ant.design                         |
| Angular     | https://angular.io/                   |
| Replica     | https://docs.google.com/document/d/1jvUtRUAkfhd9w1zOp41nywfAA3DtUVq2omT7tIc_QPc/edit?usp=sharing                           |