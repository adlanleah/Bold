import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  products = [
    {
      name: 'Bold Signature Tee',
      price: 'UGX 30,000',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn8edYXFzFKOrNOcbw3whE2W_FV1rXQCe0EsAoPP620IteKWgmc5mFgRbUUc_ODBVoM9dY53vp2Tr_vEwV5iDxuF3mNy-UVjuoVNSQ5APjRrWIPezwLIkDKyEi-Z2PFd2XbppxiYI5GZAdmi2BA8sPtkotEG5Yxbr90oaCew0LvubRWCwTv6MKcV-s3MrpKwVJNSyH9IHAcGHT5qcYs-N1FuP8lXl9gzpxoou64WtlZO44IQMtXxUYK5DwGw97k-M56keG66MOVUZA',
    },
    {
      name: 'Identity Hoodie',
      price: 'UGX 50,000',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjnY5gsjK8pDfPWZ4p8IPUm4C2m2ItPfO3R_z6kQW3ROaZn_WBsj1iq9aomW_pliKiJwErsAlpXNTvN7UhWMt5DOxHZgm3zJql-G7rbm4meuTkoommFXsdCmzB-W0rjTxvoObcjKzHlPiUnV2bughg9fG94mTH_apEAORQkQ6Z37ZGIoVxplzGSh_jhFksnU8FzCzg1ylnklZOb0-f_qLJiHMu_AxLAHya697hJ5Nx3arnatjIFrFzQy_pBitrO-ErI0QYPrKCT3xO',
    },
    {
      name: 'Born Again Tee',
      price: 'UGX 30,000',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABjAQ7RsiUq0D-USk9b5mHhtz-ChYPzAH6BDSLGweaXOqCZM1UGZwOYfHJaQ-mL0ZjNEf4wwsAYI0TV7ThDnyCtifmPi0ToZTzF2oRufyaR3u5VbfEoW2JUyOnFW8Cit43a-hAOTOKcn_T1Ku7xZvQKXldg9IfJYORwolaHZM1rmSg2Fsd0kPbu0RaxNINah4osZ50ffCVxgdIBuo96UzigFiDtkCSf9gTMo99Fj7U5AJMO6Gs0V_RT7OqA9VZ1GrLciJBvYFShZ8F',
    },
    {
      name: 'Awareness Wristband',
      price: '$5.00',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL5Nv6iQHu0rwDPQ21yhHas_jC7SsiRbsE_zRyVZfIKFiTUxj9PLtw6Ert3sxiE8OFO9R5FQBnAJ-C5jEtxcm_QyepWteRf4e0SeqmPCn1zjliR1DTx_k1psaUlsLi-PECnoPAgX-qmF6MPZfpV0uye27v-0dqndzSOct4nTAxfdpwPfvN9RklkiwMCI419E1U93XR7ATEh4xQGHfV1geLt07qMBu7YWl6pNUfLWHjSOsHzEfb6_fkyXhgBaCH7HgAe0F2FnTJBLMi',
    },
  ];

}
