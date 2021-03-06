-- MySQL Script generated by MySQL Workbench
-- Wed 27 Feb 2019 11:23:49 AM EET
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pipedrive
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pipedrive
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pipedrive` ;
USE `pipedrive` ;

-- -----------------------------------------------------
-- Table `pipedrive`.`organization`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pipedrive`.`organization` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pipedrive`.`organizations_relationship`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pipedrive`.`organizations_relationship` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `organization_name` VARCHAR(256) NOT NULL,
  `parent_organization_name` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
