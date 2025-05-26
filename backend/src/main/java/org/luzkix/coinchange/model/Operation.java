package org.luzkix.coinchange.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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

        public static OperationEnum fromValue(String value) {
            for (OperationEnum enumCode : OperationEnum.values()) {
                if (enumCode.getName().equals(value)) {
                    return enumCode;
                }
            }
            throw new IllegalArgumentException("Unknown OperationEnum value: " + value);
        }
    }
}
