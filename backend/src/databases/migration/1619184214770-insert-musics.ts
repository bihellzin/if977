import { MigrationInterface, QueryRunner } from 'typeorm';
import { Music } from './../../models/music.model';

export class insertMusics1619184214770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Music)
      .values([
        {
          name: 'Anunciação',
          author: 'Alceu Valença',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/alceu_valenca-anunciacao.m4a',
        },
        {
          name: 'La Belle de Jour',
          author: 'Alceu Valença',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/alceu_valenca-la_belle_de_jour.m4a',
        },
        {
          name: 'Morena Tropicana',
          author: 'Alceu Valença',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/alceu_valenca-morena_tropicana.m4a',
        },
        {
          name: 'Meu Ébano',
          author: 'Alcione',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/alcione-meu_ebano.m4a',
        },
        {
          name: 'Você me Vira a Cabeça',
          author: 'Alcione',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/alcione-voce_me_vira_a_cabeca.m4a',
        },
        {
          name: 'Qualquer Coisa',
          author: 'Caetano Veloso',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/caetano_veloso-qualquer_coisa.m4a',
        },
        {
          name: 'Você é Linda',
          author: 'Caetano Veloso',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/caetano_veloso-voce_e_linda.m4a',
        },
        {
          name: 'Preciso me Encontrar',
          author: 'Cartola',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/cartola-preciso_me_encontrar.m4a',
        },
        {
          name: 'Fio Maravilha',
          author: 'Jorge Ben Jor',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/jorge_ben_jor-fio_maravilha.m4a',
        },
        {
          name: 'Mas que Nada',
          author: 'Jorge Ben Jor',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/jorge_ben_jor-mas_que_nada.m4a',
        },
        {
          name: 'Jack Soul Brasileiro',
          author: 'Lenine',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/lenine-jack_soul_brasileiro.m4a',
        },
        {
          name: 'Mania de Você',
          author: 'Rita Lee',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/rita_lee-mania_de_voce.m4a',
        },
        {
          name: 'Mina do Condomínio',
          author: 'Seu Jorge',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/seu_jorge-mina_do_condomínio.m4a',
        },
        {
          name: 'Camarão que Dorme a Onda Leva',
          author: 'Zeca Pagodinho',
          genre: { id: 3, name: 'Brasileiras' },
          url: 'brasileiras/zeca_pagodinho-camarao_que_dorme_a_onda_leva.m4a',
        },
        {
          name: 'Thank U, Next',
          author: 'Ariana Grande',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/ariana_grande-thank_u_next.m4a',
        },
        {
          name: 'Bad Guy',
          author: 'Billie Eilish',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/billie_eilish-bad_guy.m4a',
        },
        {
          name: 'Locked Out of Heaven',
          author: 'Bruno Mars',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/bruno_mars-locked_out_of_heaven.m4a',
        },
        {
          name: 'New Rules',
          author: 'Dualipa',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/dua_Lipa-new_rules.m4a',
        },
        {
          name: 'Believer',
          author: 'Imagine Dragons',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/imagine_dragons-believer.m4a',
        },
        {
          name: 'Power',
          author: 'Kanye West',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/kanye_west-power.m4a',
        },
        {
          name: 'Stronger',
          author: 'Kanye West',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/kanye_west-stronger.m4a',
        },
        {
          name: 'Bad Romance',
          author: 'Lady Gaga',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/lady_gaga-bad_romance.m4a',
        },
        {
          name: 'Same Old Love',
          author: 'Selena Gomez',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/selena gomez-same_old_love.m4a',
        },
        {
          name: 'Cheap Thrills',
          author: 'Sia',
          genre: { id: 1, name: 'Pop' },
          url: 'pop/sia-cheap_thrills.m4a',
        },
        {
          name: 'Com ou Sem Mim',
          author: 'Gustavo Mioto',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/gustavo_mioto-com_ou_sem_mim.m4a',
        },
        {
          name: 'Espetinho',
          author: 'Gusttavo Lima',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/gusttavo_lima-espetinho.m4a',
        },
        {
          name: 'O Nosso Santo Bateu',
          author: 'Matheus e Kauan',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/matheus_e_kauan-o_nosso_santo_bateu.m4a',
        },
        {
          name: 'Quarta Cadeira',
          author: 'Matheus e Kauan',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/matheus_e_kauan-quarta_cadeira.m4a',
        },
        {
          name: 'Ta Rocheda',
          author: 'Os Barões da Pisadinha',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/os_baroes_da_pisadinha-ta_rocheda.m4a',
        },
        {
          name: 'Bebe Vem Me Procurar',
          author: 'Rai Saia Rodada',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/rai_saia_rodada-bebe_vem_me_procurar.m4a',
        },
        {
          name: 'Tapão na Raba',
          author: 'Rai Saia Rodada',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/rai_saia_rodada-tapao_na_raba.m4a',
        },
        {
          name: 'Decreto Liberado',
          author: 'Wesley Safadão',
          genre: { id: 2, name: 'Sertanejo' },
          url: 'sertanejo/wesley_safadao-decreto_liberado.m4a',
        },
        {
          name: 'Ele É Ele Eu Sou Eu',
          author: 'Wesley Safadão e Barões da Pisadinha',
          genre: { id: 2, name: 'Sertanejo' },
          url:
            'sertanejo/wesley_safadao_e_baroes_da_pisadinha-ele_e_ele_eu_sou_eu.m4a',
        },
        {
          name: 'Na Cama que Eu Paguei',
          author: 'Wesley Safadão ft Zé Neto e Cristiano',
          genre: { id: 2, name: 'Sertanejo' },
          url:
            'sertanejo/wesley_safadao_ze_neto_e_cristiano-na_cama_que_eu_paguei.m4a',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('music');
  }
}
