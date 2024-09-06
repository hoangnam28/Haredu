import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';
import { IFiled } from '#interfaces/account.interface';
import { UserRepository } from '#repositories/user.repository';
import { IPostCard } from '#interfaces/post.interface';
import { USER_ROLE } from '#utils/const';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent extends BaseComponent implements OnInit {
  fileds: IFiled[] = [];
  postDemos: IPostCard[] = [
    {
      user: {
        _id: 'c7c02c5a-5b57-4b45-90cc-d64a769a0071',
        name: 'John Doe',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        password: 'password123',
        role: USER_ROLE.TUTOR,
        isActive: true,
        deletedAt: null,
        status: true,
      },
      content: 'This is a sample post content.',
      images: [
        {
          _id: 'e1bbaff5-0a5b-4b6d-9c37-63d63e444b5f',
          url: 'https://randomwordgenerator.com/img/picture-generator/53e6d74a425ab10ff3d8992cc12c30771037dbf852547849752678d7924c_640.jpg',
        },
        {
          _id: 'ffdd44a5-2939-4d5f-8297-89dba14ff8d5',
          url: 'https://randomwordgenerator.com/img/picture-generator/54e2d2464e57aa14f1dc8460962e33791c3ad6e04e507440752972d3934fc0_640.jpg',
        },
      ],
      like: 150,
      share: 20,
      comment: [
        {
          user: {
            _id: 'a7e32b65-5ad5-4a19-8fbd-1b37b2c29a61',
            name: 'Jane Smith',
            phone: '098-765-4321',
            email: 'jane.smith@example.com',
            password: 'password456',
            role: USER_ROLE.TUTOR,
            isActive: true,
            status: false,
          },
          like: 15,
          content: 'Great post!',
          replyComment: [],
        },
      ],
      createdAt: new Date(),
    },
    {
      user: {
        _id: 'd3e4c5f6-8b2c-4b6d-90cc-d64a769a0091',
        name: 'Alice Johnson',
        phone: '234-567-8901',
        email: 'alice.johnson@example.com',
        password: 'password789',
        role: USER_ROLE.TUTOR,
        isActive: false,
        status: true,
      },
      content: 'Exploring the beauty of nature.',
      images: [
        {
          _id: 'b2bc9b22-4a7f-4d19-9b36-73a65e284d7f',
          url: 'https://randomwordgenerator.com/img/picture-generator/57e7d1404c56a914f1dc8460962e33791c3ad6e04e50744172297cd59144cc_640.jpg',
        },
      ],
      like: 200,
      share: 30,
      comment: [
        {
          user: {
            _id: 'c4e82b66-7c9d-4e16-9d2d-5c7b4f1d2e5c',
            name: 'Bob Brown',
            phone: '345-678-9012',
            email: 'bob.brown@example.com',
            password: 'password123',
            role: USER_ROLE.TUTOR,
            isActive: true,
            deletedAt: null,
            status: true,
          },
          like: 50,
          content: 'Amazing scenery!',
          replyComment: [
            {
              user: {
                _id: 'e5c2c3f8-6c9d-4e16-9c3e-5a7b4d1d3e4f',
                name: 'Charlie Davis',
                phone: '456-789-0123',
                email: 'charlie.davis@example.com',
                password: 'password456',
                role: USER_ROLE.TUTOR,
                isActive: true,
                deletedAt: null,
                status: true,
              },
              like: 25,
              content: 'I want to go there too!',
              replyComment: [],
            },
          ],
        },
      ],
      createdAt: new Date(),
    },
    {
      user: {
        _id: 'f4e8d5f9-9b3c-4a6d-80cc-d64a769a0092',
        name: 'Eve Walker',
        phone: '567-890-1234',
        email: 'eve.walker@example.com',
        password: 'password321',
        role: USER_ROLE.TUTOR,
        isActive: true,
        status: false,
      },
      content: 'Had a wonderful day at the beach!',
      images: [
        {
          _id: 'c3ac6b23-1c8f-4d19-8b36-63a74e264d8e',
          url: 'data:image/jpeg;base64,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',
        },
      ],
      like: 250,
      share: 40,
      comment: [
        {
          user: {
            _id: 'd5c82d67-7c8d-4e16-9e2d-5c7b5f2e5c6d',
            name: 'Frank Green',
            phone: '678-901-2345',
            email: 'frank.green@example.com',
            password: 'password789',
            role: USER_ROLE.TUTOR,
            isActive: false,
            deletedAt: null,
            status: true,
          },
          like: 60,
          content: 'Looks like fun!',
          replyComment: [],
        },
      ],
      createdAt: new Date(),
    },
    {
      user: {
        _id: 'g6d2c3f7-8d9c-4a6d-80cc-d64a769a0073',
        name: 'Grace Hall',
        phone: '789-012-3456',
        email: 'grace.hall@example.com',
        password: 'password654',
        role: USER_ROLE.STUDENT,
        isActive: true,
        status: false,
      },
      content: 'Enjoying a quiet evening with a book.',
      images: [
        {
          _id: 'd4bc8b24-2c9f-4e16-9d2d-7a7b4e3d2e6d',
          url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIRERUSEREQExMWFRYaGBYTFRgYFRYVFRgaFxYYFhcYKCggGBolGxMWIjEiMSkrLy4uGCAzODMsOCgtLjcBCgoKDg0OGxAQGzUmHyU3NzgtKy8rOC8vLTIuLSstLy0tNS0rLS0tMC0vLS8tLS0uLS8tLS0tLS0rNzUtNS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwYCBAUBB//EADYQAAIBAgMECAYCAgIDAAAAAAABAgMREiExBAVBYRQiMlFTcZKxBhNygZGhQsHR8CPhQ1Lx/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECBAMFBv/EACsRAAICAQQBAgUEAwAAAAAAAAABAhEDBBIhMUETcQUiMlFhgbHB8RSRof/aAAwDAQACEQMRAD8At20bXUxy/wCSp2n/ACfeR9LqeJU9UjHae3L6pe5Geikjy22TdLqeJU9Uh0up4lT1SO3sXw8mozdS8ZQUk4pZSdmk074l+DtbJuynCrKrGKTaSstE+LXdfL995yllijtHDNlK6XU8Sp6pDpdTxKnqkWGv8NKVS8GqdPCr6t4s72XdaxXdqoOnOUHrF2LRlGXRScJx7Pel1PEqeqQ6XU8Sp6pEIL0jnbJul1PEqeqQ6XU8Sp6pEIFIWybpdTxKnqkOl1PEqeqRCBSFsm6XU8Sp6pDpdTxKnqkQgUhbJul1PEqeqQ6XU8Sp6pEIFIWybpdTxKnqkOl1PEqeqRCBSFsm6XU8Sp6pDpdTxKnqkQgUhbJul1PEqeqQ6XU8Sp6pEIFIWybpdTxKnqkOl1PEqeqRCBSFsm6XU8Sp6pDpdTxKnqkQgUhbJul1PEqeqQ6XU8Sp6pEIFIWybpdTxKnqkOl1PEqeqRCBSFsm6XU8Sp6pDpdTxKnqkQgUhbJul1PEqeqQ6XU8Sp6pEIFIWybpdTxKnqkCECkLZJtPbl9Uvc2N0VoRqrHT+ZF5YbYnnxS4vI19p7cvql7nR+HKsIVG51FTy4pZ8sT7P9lZfSXh9RbdnhCnDq9WCu7Z9Xi8nmvI5Et9Sv1YRw873/6Oo5wq05YHiTTV87X01ZXZbHUTs4Tv5O350PlPjeo1eJwWC6fbSvn7df2e3pYY5J7iy7PtMZwU0nbuSbatqrLNlU+ItojKSUaLpu7blKOGU78uK5ln3Zs7hTSyvdt+b4exw/ibecZR+VGUXn1k4NOLXN6d2n3Pd0TyOEXkXzUr9/Jh1SVOnwV0AxlJLNtJcz0Tzj1s9Jt5/DG01aVoxXajdXV7Xs7Llqa8Hrlazsudkr37s7q3IqpJvgs4tLkyABYqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASbT25fVL3IyTae3L6pe5GQiX2Wvc+9aUdnTm1HB1cN1ik9bpc7/pnX2XaIzs074oqS8uP4ukfPSWhtU4dico5NZPg9UcZYb6NENQ1wzu19/rDeF1Vi7aXhON+PK33Rxt47Z86o6jiotpZLkrXNU9OkYJdHKWSUuweRqqEoSk7JTi8tXheK0c1aWWT5HpHWzVrJt8Hyzuyz6KLsu7rrEq3zYqmkrxvo3G6TSyvZp9+a5FT2+SlVnKLk05O15OXLJvO2RoQ2eSlf5s7cY5YW/xzNgz4NNHC5NeXfZ3zZ3kST8AAGkzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEm09uX1S9yMk2nty+qXuRkIl9g4vxKnana+r/OVv7OtCrecoKLcko2X/ALYr2t91Y9hu+tOnGpW2ecMM75rui5KVtUrP9FZNVRaKfZ4ppNRb6zTfnhsm/wBokNWFRKbUpKTb6uWajKzaduGV7m0WRVg8SPYq7sjtbH8P1MdqqSSaur9qL1wtdxEpJdlowcujigtey/DsIqpi617qDesVa9/qv7czlVtwVcc1BXjHSTyxZJ2Xe87FVliyzwzS6OSA0DocgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACTae3L6pe5GSbT25fVL3IyES+zPdc1T2iM6sk6bdksKck3ko81fjlbv4l2cpxnN1JRVNppdnl3+fHLM+ezp4Z48UrfyjqsovNdz9yCvt+0JYflTkrt9ad0m+5LT/AOviZc+BZJRbbVPx59/waMObYmq7N2nxSi4q7snhvhvk3hsllw4GZ4j01Gc6G5dno1JOFaUotpYWmkr8U2+OlvuXRLDDryvhWcnle3F8ytfCuyKTlJwg7NK8ndp8o/3/ANnc3rTbpSSbvlkuTuzBrMjhCUoq2k3X6G/SwtK/JDHfNPS07X1t/Wp0nUilicko2ve+VvMp6z0LTslLDTjGaTsuNnbl/R4Hwb4jn1cpLIuF5S/4ehqcMcaW0pm91R+Z/wAMpSX8m805Xzs+JpHc+KFTUoqFOMZauUWs13OK434s4Z9ZB3E8PIqkwAC5zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJNp7cvql7kZJtPbl9UvciaIJfZE1ilf+K/b/wrL7+RMeHtgADOpRlFRcotKSvFtarvRgAC97DXpxoxkmo00kk3lplx43uiiHrm2km20tFfJX1suBScNx0x5Nln0CUYpSlhjdJvJK+Svr9jm1t+U4KMlJVISycU1jjzs+HCz5HAjvmrhnFtSxRUbvVJXWT77N5nNxrEo/yd7Li7W/yjlHAl2dp6hv6SbanBzk6aag28KfBdxGTz2Koo4nTko97XK/sV3Ya9StXc05KnG+X8bcFbi3r/AKjvuRm2vydsAFioAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJtPbl9UvcjJNp7cvql7kZCJfZ0dx7DCvKUJylGWG8bW1466+XmWenuukqbpuPVla6u2sSVsUb6P/BHuSrOdKPzadsKWCTtmkrJ21i7fk83vvFxajCydrt279LXPM12tjp4PJkfC+38Ho6bBu4Rt7x2KNWLg1G+FqLa7N7Zr8Iru/dzwo04yhJt3s8XG6vdW00Z091bynKahN3xaOyTus7ZcDd3lXrRT+TSxPvcll5RveRTQa6Gphvxvj7PgtqMG21LsoYPZxabTTTWqas0+aPD1zywZ7hSW0RlWw9WUkna9084pJaPs58LX5mrtlPFGybTumrd6d/xkQqnCUsUFGUlrN5278PP9L9FZc8FouuT6M51FOfzHFUmrK9uNkvzfjxZ8+qU85wp2hTTWFxSTs83lonp5XM9onUlghJucFJyzk7xlriz1u/vcQoRjJyV1fVXeHztpcz6fT+kmrbt+fz49vsd82b1K4olABqMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJtPbl9UvciJdp7cvql7kZCJfZct2b1oyw06aqylb+ebVtXKTY3tsEqjU420s1e3k+epWtzbYqVVSeUWsMnZu0W020l5Fjp7/pznKKySjeLeWJrN+WWn3PN12hhqIPHNcHoafU7eb5Md27vcJY6nVtor31yu2b29ds+TDE1Np5Xgo5N6Xvp55mpvve3yZUnFKSkpNq9rrq4Wnw4lc2jek5RlTTtSk8ouzwq97J8FloV0Oghp8ahjXH58k6jVbm77NOtVcpOUm227tvUjbfBL7/4RkD1DziL5N+08XLSP44/e5lU+GZ7RhqQTptuyqLTLLrWzWlr/AGJ9njFziptqLau1qlxZeN1bEqUXGM8dN5xvbK+uayaf+6nLLLajthhuZxaHw1nTu21b/kTavdL+LXBteauQb33G4zXyU5KUmlFaxyT1fDXPgWDaN406csLbb5K9jZ2WvGccUXde3JmOGuhLI4RmnJdqzXLSrbdfqUDatnlTk4TVpK2WT1V1mvMiLL8V06XadR/NSSUFa1r3ba1WrzvwK0b4S3KzDkjtlQABc5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEm09uX1S9yMk2nty+qXuRkIl9kVHaYTbUZJuOtuBKcbcOzuM6rfB4fum2/6/J1aFTFGMrNXSdnqrkRdolqmSN31/1AAsVAAANndlD5lWMcOK7zV8N0k3rwWRe6FBQilFRgu6OS/7PncXbNZPkWn4VqYoyxScp4s7ttqCStrpdt/6jhmi6s06eSTo0dpTU5X1xP3Ot8Pwdpu3Vdl5tXv7m/OnTqNNxhLVXsnnHVX5Wf4NevtkYY4wlFSp5uDdk1ZSy+z14HzOj+CvBqvWcrXNL345/wBnrZdUpY9tGvvvZaCpSm6KvwcFGLTejbyvn5+RTzqb+2ylWlGdPEpWeJNeVvvr+jln1ONNLk8XNJOXAAB0OQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3g5J1HBJyTlZPRu7yNHb5Vko1KScorOcUru1r/pX8jc3nCLx43hjied8NrSyd+GZc9nl8uFKNKEZxeUpReJdz6yy7833GXU51hhul+Ovc0YcXqSpFBqThNYUnd9eOHK7UrJp6X0+xu7FCdRqKg1Juyi2r8s1kb3xPs1tpvB04pJXio3t38UotpLgbW4Nip1f/JKFaMrxta1lZp2fazvdXO275dxTZ820z3fuCUm/m9VZppPrJ2yfc19+Ju0PhuPympv/AJHLKS4RUrKy5r35Hcr1FGOKbSss3/hGnR3tTk1HrLm1k/wYMuux45qM5pN9KzdDSpq0rKrU3RWUZywdWDavpeztdLVo0T6LtLWCWKWCNmm7pWvlq8kUHboU1NqlKUoLRy1ff3ZXNuPI5dmPNiUOiAzpV5QvhlKN1Z2bV19jA8bsdTib2wb0qUbJWcVLFZ+TTSfBNM19u2l1JyqSsru/JJafhI0JbXhhOc4tKMmlbVpPCn92Q7yqSnRSppt1LW5Rau793d9yvC5LW2q8G1s21QqXcJXs7PX+yY0t3bLGisF05yzfO3dyV/2bpZdclWAASQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZbXFOU00mnKV09HmzHZ947RCn8qhUwximliTlZNtpRd7ppO9/p7j3bG8cktcUvtm82YU4KKsirSfZfc0+DX2SNfE3Wqqd9P9svwXL4X2JOHzHTjdt2m3d5O2Uf4+d7lXJdmnaSTk1FyWKzayvnpyKyjcaRMJ1K2XDf0X8tWbdpK65Wef59zhRg5NJK7eSRaqdSGGLySlZRWl7rJJeWZFV+XSg6mGKS1aSva9uHmfL6/4L/l51k3Uumq/Y9vFqvThVE8qUWkpxjPLik/PUp3xBGnGrhp08Fl1s1Zvg0k3b9eR3Nr3vSj1KjVSnOOTg02uUl7PX3Kg7cND6TDBo8vUTT4QNba5QlelK7vG9l3XsrPvvY2GzWlPE8UY4mk8LeSz1z43ssl97HdmVHV+HdhhtONVoTwQSviVsXG+Tv8Ax058jpbbu/Z+jyqUKc4unFJRjnlHvV88nre/mV3cO/vl1WljxtNOE7qLaT4J2y/Nr+Z2dv3w5xcIRjCDtdLW+V9PL9syyjleWMov5fP8GmMsaxtSXJwthhHBFq7tFRvJNS6vffPW5sgGpGYAAkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz2hdeX1S9zAAhEvsAAkgke0TvF45XjbDdvq20w92hu198VJ0pU5YetK7ej4Oy5XSPAVcUyyk0c88Z6CxUwdNcc/PP8AWiMwCCTB01fFZYu+yvbzMwCSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z',
        },
      ],
      like: 120,
      share: 15,
      createdAt: new Date(),
      comment: [
        {
          user: {
            _id: 'e6c9d4f8-8d9d-4e16-9f3e-6a7b4e4f3e7f',
            name: 'Hannah White',
            phone: '890-123-4567',
            email: 'hannah.white@example.com',
            password: 'password321',
            role: USER_ROLE.STUDENT,
            isActive: true,
            deletedAt: null,
            status: true,
          },
          like: 30,
          content: 'What book are you reading?',
          replyComment: [],
        },
      ],
    },
    {
      user: {
        _id: 'i8e2d4f9-9d3c-4a7d-90cc-d64a769a0094',
        name: 'Ivy Carter',
        phone: '901-234-5678',
        email: 'ivy.carter@example.com',
        password: 'password987',
        role: USER_ROLE.TUTOR,
        isActive: false,
        status: true,
      },
      content: 'Just finished a marathon!',
      createdAt: new Date(),
      images: [
        {
          _id: 'e5ec6b25-3c9d-4d19-9d2d-8a7b4e5f4e7f',
          url: 'data:image/jpeg;base64,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',
        },
      ],
      like: 300,
      share: 50,
      comment: [
        {
          user: {
            _id: 'f7d2d5f0-9c9d-4e16-9e3e-7a7b5f3f4e8f',
            name: 'Jack Brown',
            phone: '012-345-6789',
            email: 'jack.brown@example.com',
            password: 'password123',
            role: USER_ROLE.TUTOR,
            isActive: true,
            deletedAt: null,
            status: true,
          },
          like: 75,
          content: 'Congratulations!',
          replyComment: [],
        },
      ],
    },
  ];
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userRepository: UserRepository,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      fileds: [[], []],
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getFields();
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  getFields() {
    this.subscribeOnce(this.userRepository.getFields({}), {
      onSuccess: (response) => {
        this.fileds = response;
        this.cdr.detectChanges();
      },
    });
  }
}
