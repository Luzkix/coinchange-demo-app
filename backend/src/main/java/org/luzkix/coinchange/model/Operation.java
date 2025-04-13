package org.luzkix.coinchange.model;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "operations")
public class Operation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @ManyToMany(mappedBy = "operations", fetch = FetchType.LAZY)
    private Set<Role> roles;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public enum OperationEnum {
        ADMIN("ACCESS_USER_SECTION", "Access to user trading and account section"),
        USER("ACCESS_ADMIN_SECTION", "Access to admin settings section");

        private final String name;
        private final String desc;

        OperationEnum(String name, String desc) {
            this.name = name;
            this.desc = desc;
        }

        public String getName() {
            return name;
        }

        public String getDesc() {
            return desc;
        }

        public static Operation.OperationEnum getOperationEnumFromValue(String value) {
            for (Operation.OperationEnum enumCode : Operation.OperationEnum.values()) {
                if (String.valueOf(enumCode.getName()).equals(value)) {
                    return enumCode;
                }
            }
            return null;
        }
    }
}
