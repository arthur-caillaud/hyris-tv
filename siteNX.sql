-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mar 21 Février 2017 à 22:22
-- Version du serveur :  5.5.53-0+deb8u1
-- Version de PHP :  5.6.29-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `siteNX`
--

-- --------------------------------------------------------

--
-- Structure de la table `Commentaire`
--

CREATE TABLE IF NOT EXISTS `Commentaire` (
  `commentaire` varchar(140) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `date` date NOT NULL,
  `id_video` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Commentaire_projet`
--

CREATE TABLE IF NOT EXISTS `Commentaire_projet` (
  `commentaire` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `frame_video` int(11) NOT NULL,
  `id_video` int(11) NOT NULL,
  `date` date NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Contexte`
--

CREATE TABLE IF NOT EXISTS `Contexte` (
  `label` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `id_image` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Contexte_video`
--

CREATE TABLE IF NOT EXISTS `Contexte_video` (
  `id_video` int(11) NOT NULL,
  `id_contexte` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Diff`
--

CREATE TABLE IF NOT EXISTS `Diff` (
  `titre` varchar(50) NOT NULL,
  `description` varchar(800) NOT NULL,
  `cle_stream` varchar(20) NOT NULL,
  `is_ouvert` tinyint(1) NOT NULL,
  `is_public` tinyint(1) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_image` int(11) NOT NULL,
  `date_deb` date NOT NULL,
  `date_fin` date NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Direct`
--

CREATE TABLE IF NOT EXISTS `Direct` (
  `label` varchar(50) NOT NULL,
  `description` varchar(800) NOT NULL,
  `date` date NOT NULL,
  `id_image` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Direct_video`
--

CREATE TABLE IF NOT EXISTS `Direct_video` (
  `id_video` int(11) NOT NULL,
  `id_direct` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Droit`
--

CREATE TABLE IF NOT EXISTS `Droit` (
  `label` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `description` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Droit_role`
--

CREATE TABLE IF NOT EXISTS `Droit_role` (
  `id_droit` int(11) NOT NULL,
  `id_role` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Encode`
--

CREATE TABLE IF NOT EXISTS `Encode` (
  `label` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `commande` varchar(100) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Encode_video`
--

CREATE TABLE IF NOT EXISTS `Encode_video` (
  `id_encode` int(11) NOT NULL,
  `id_video` int(11) NOT NULL,
  `is_encode` tinyint(1) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Image`
--

CREATE TABLE IF NOT EXISTS `Image` (
  `titre` varchar(50) NOT NULL,
  `date` date NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Presta_avancement`
--

CREATE TABLE IF NOT EXISTS `Presta_avancement` (
  `description` varchar(500) NOT NULL,
  `s_val` varchar(100) NOT NULL,
  `f_val` float NOT NULL,
  `b_val` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Presta_contact`
--

CREATE TABLE IF NOT EXISTS `Presta_contact` (
  `message` varchar(500) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `societe` varchar(50) DEFAULT NULL,
  `mail` varchar(50) NOT NULL,
  `num_tel` varchar(25) NOT NULL,
  `date` date NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Presta_projet`
--

CREATE TABLE IF NOT EXISTS `Presta_projet` (
  `titre` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `is_paye` tinyint(1) NOT NULL,
  `id_user` tinyint(1) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Role`
--

CREATE TABLE IF NOT EXISTS `Role` (
  `label` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Role_user`
--

CREATE TABLE IF NOT EXISTS `Role_user` (
  `id_role` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Societe_user`
--

CREATE TABLE IF NOT EXISTS `Societe_user` (
  `id_user` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `societe` varchar(50) NOT NULL,
  `adresse` varchar(100) NOT NULL,
  `code_postal` int(11) NOT NULL,
  `pays` varchar(50) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `num_tel` varchar(50) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Type_avancement`
--

CREATE TABLE IF NOT EXISTS `Type_avancement` (
  `label` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `login` varchar(100) NOT NULL,
  `surnom` varchar(100) DEFAULT NULL,
  `mdp` varchar(100) NOT NULL,
  `is_myecs` tinyint(1) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `User_trans`
--

CREATE TABLE IF NOT EXISTS `User_trans` (
  `id_projet` int(11) NOT NULL,
  `moyen_paiement` varchar(50) NOT NULL,
  `info_sup` varchar(500) NOT NULL,
  `montant` float NOT NULL,
  `date` date NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Video`
--

CREATE TABLE IF NOT EXISTS `Video` (
  `titre` varchar(50) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `nom_video` varchar(50) NOT NULL,
  `description` varchar(250) NOT NULL,
  `date` date NOT NULL,
  `is_diff` tinyint(1) NOT NULL,
  `is_private` tinyint(1) NOT NULL,
  `id_user` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `id_image` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Vote`
--

CREATE TABLE IF NOT EXISTS `Vote` (
  `val` int(11) NOT NULL,
  `date` date NOT NULL,
  `id_video` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Commentaire_projet`
--
ALTER TABLE `Commentaire_projet`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Contexte`
--
ALTER TABLE `Contexte`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Contexte_video`
--
ALTER TABLE `Contexte_video`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Diff`
--
ALTER TABLE `Diff`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Direct`
--
ALTER TABLE `Direct`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Direct_video`
--
ALTER TABLE `Direct_video`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Droit`
--
ALTER TABLE `Droit`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Droit_role`
--
ALTER TABLE `Droit_role`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Encode`
--
ALTER TABLE `Encode`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Encode_video`
--
ALTER TABLE `Encode_video`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Image`
--
ALTER TABLE `Image`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Presta_avancement`
--
ALTER TABLE `Presta_avancement`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Presta_contact`
--
ALTER TABLE `Presta_contact`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Presta_projet`
--
ALTER TABLE `Presta_projet`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Role`
--
ALTER TABLE `Role`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Role_user`
--
ALTER TABLE `Role_user`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Societe_user`
--
ALTER TABLE `Societe_user`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Type_avancement`
--
ALTER TABLE `Type_avancement`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `User_trans`
--
ALTER TABLE `User_trans`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Video`
--
ALTER TABLE `Video`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Vote`
--
ALTER TABLE `Vote`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Commentaire_projet`
--
ALTER TABLE `Commentaire_projet`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Contexte`
--
ALTER TABLE `Contexte`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Contexte_video`
--
ALTER TABLE `Contexte_video`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Diff`
--
ALTER TABLE `Diff`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Direct`
--
ALTER TABLE `Direct`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Direct_video`
--
ALTER TABLE `Direct_video`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Droit`
--
ALTER TABLE `Droit`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Droit_role`
--
ALTER TABLE `Droit_role`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Encode`
--
ALTER TABLE `Encode`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Encode_video`
--
ALTER TABLE `Encode_video`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Image`
--
ALTER TABLE `Image`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Presta_avancement`
--
ALTER TABLE `Presta_avancement`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Presta_contact`
--
ALTER TABLE `Presta_contact`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Presta_projet`
--
ALTER TABLE `Presta_projet`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Role`
--
ALTER TABLE `Role`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Role_user`
--
ALTER TABLE `Role_user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Societe_user`
--
ALTER TABLE `Societe_user`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Type_avancement`
--
ALTER TABLE `Type_avancement`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `User_trans`
--
ALTER TABLE `User_trans`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Video`
--
ALTER TABLE `Video`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Vote`
--
ALTER TABLE `Vote`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
