package com.meeseek.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonIgnore
    private Long id;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "others")
    private String others;

    @OneToOne
    @PrimaryKeyJoinColumn
    @JsonIgnore
    private Order order;
}
