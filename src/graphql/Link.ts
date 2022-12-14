import { extendType, idArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("description");
        t.nonNull.string("url");
    },
});

let links: NexusGenObjects["Link"][] = [
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve() {
                return links;
            },
        });
        t.nonNull.field("link", {
            type: "Link",
            args: {
                id: nonNull(idArg()),
            },

            resolve(root, args) {
                const { id } = args;
                const resolvedPost = links.find(
                    ({ id: existingId }) => existingId.toString() === id
                );

                return resolvedPost ?? { id: -1, description: "Not Found", url: "Not Found" };
            },
        });
    },
});

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },

            resolve(root, args) {
                const { description, url } = args;

                let idCount = links.length + 1;
                const link = {
                    id: idCount,
                    description,
                    url,
                };
                links.push(link);
                return link;
            },
        });
        t.nonNull.field("updateLink", {
            type: "Link",
            args: {
                id: nonNull(idArg()),
                url: stringArg(),
                description: stringArg(),
            },

            resolve(root, args) {
                const { id, url, description } = args;

                const resolvedLinkIndex = links.findIndex(
                    ({ id: existingId }) => existingId.toString() === id
                );

                if (url) links[resolvedLinkIndex].url = url;
                if (description) links[resolvedLinkIndex].description = description;

                return links[resolvedLinkIndex];
            },
        });
        t.nonNull.field("deleteLink", {
            type: "Link",
            args: {
                id: nonNull(idArg()),
            },

            resolve(root, args) {
                const { id } = args;

                const linkToDelete = links.find(
                    ({ id: existingId }) => existingId.toString() === id
                );

                const linksWithoutDeletedLink = links.filter(
                    ({ id: existingId }) => existingId.toString() !== id
                );

                links = linksWithoutDeletedLink;

                return linkToDelete as NexusGenObjects["Link"];
            },
        });
    },
});
